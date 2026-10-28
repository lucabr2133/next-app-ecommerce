import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { validateSchema } from "@/app/(main)/schemas";
import { auth } from "@/auth";
import { sql } from "@/supabase";

const supabase = createClient(
  (process.env.SUPABASE_URL || "https://placeholder.supabase.co") as string,
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder") as string
);

export async function GET(request: Request) {
  const url = new URL(request.url);

  const order = url.searchParams.get("order") ?? "release_at";
  const quantity = url.searchParams.get("quantity");
  const rawGenre = url.searchParams.get("genre");
  const rawSearch = url.searchParams.get("search");

  const genre = rawGenre && rawGenre !== "undefined" ? rawGenre : null;
  const search = rawSearch && rawSearch !== "undefined" ? rawSearch : null;

  const validOrders = ["release_at", "rating", "price", "metacritic", "title"];

  if (!validOrders.includes(order)) {
    return Response.json({ error: "Invalid order parameter" }, { status: 400 });
  }

  try {
    const hasLimit = quantity && quantity !== "all" && Number(quantity) > 0;
    const limitVal = hasLimit ? Number(quantity) : null;

    let data;

    if (genre && search) {
      data = limitVal
        ? await sql`
            SELECT DISTINCT g.*
            FROM games g
            INNER JOIN genre_games gg ON gg.game_id = g.id
            WHERE gg.genre_id = ${genre}
              AND g.title ILIKE ${"%" + search + "%"}
            ORDER BY ${sql(order)} DESC
            LIMIT ${limitVal}
          `
        : await sql`
            SELECT DISTINCT g.*
            FROM games g
            INNER JOIN genre_games gg ON gg.game_id = g.id
            WHERE gg.genre_id = ${genre}
              AND g.title ILIKE ${"%" + search + "%"}
            ORDER BY ${sql(order)} DESC
          `;
    } else if (genre) {
      data = limitVal
        ? await sql`
            SELECT DISTINCT g.*
            FROM games g
            INNER JOIN genre_games gg ON gg.game_id = g.id
            WHERE gg.genre_id = ${genre}
            ORDER BY ${sql(order)} DESC
            LIMIT ${limitVal}
          `
        : await sql`
            SELECT DISTINCT g.*
            FROM games g
            INNER JOIN genre_games gg ON gg.game_id = g.id
            WHERE gg.genre_id = ${genre}
            ORDER BY ${sql(order)} DESC
          `;
    } else if (search) {
      data = limitVal
        ? await sql`
            SELECT DISTINCT g.*
            FROM games g
            WHERE g.title ILIKE ${"%" + search + "%"}
            ORDER BY ${sql(order)} DESC
            LIMIT ${limitVal}
          `
        : await sql`
            SELECT DISTINCT g.*
            FROM games g
            WHERE g.title ILIKE ${"%" + search + "%"}
            ORDER BY ${sql(order)} DESC
          `;
    } else {
      data = limitVal
        ? await sql`
            SELECT DISTINCT * FROM games
            ORDER BY ${sql(order)} DESC
            LIMIT ${limitVal}
          `
        : await sql`
            SELECT * FROM games
            ORDER BY ${sql(order)} DESC
          `;
    }

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching games:", error);

    return Response.json({ error: "Failed to fetch games" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const formdata = await request.formData();
  const file = formdata.get("file") as File | null;

  if (!file || file.size === 0) {
    return Response.json(
      { success: false, error: "Please provide a cover image" },
      { status: 400 }
    );
  }

  const validateFormSchema = validateSchema(formdata);

  if (!validateFormSchema.success) {
    const flattened = z.flattenError(validateFormSchema.error);

    return Response.json(
      { success: false, errors: flattened },
      { status: 400 }
    );
  }

  const filePath = `uploads/${Date.now()}-${file.name}`;
  const validateData = validateFormSchema.data;

  try {
    const { data, error } = await supabase.storage
      .from("games")
      .upload(filePath, file);

    if (error) throw error;

    const companyName =
      validateData.company_name.charAt(0).toUpperCase() +
      validateData.company_name.slice(1).toLowerCase();

    let [company] = await sql`
      SELECT * FROM companies WHERE name = ${companyName};
    `;

    if (!company) {
      const result = await sql`
        INSERT INTO companies (name)
        VALUES (${companyName})
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
      `;

      company = result[0];
    }

    const { data: publicUrl } = supabase.storage
      .from("games")
      .getPublicUrl(filePath);

    const game = await sql`
      INSERT INTO games (company_id, title, description, price, release_at, stock, updated_at, metacritic, img_url)
      VALUES (
        ${company.id},
        ${validateData.title},
        ${validateData.description},
        ${validateData.price},
        ${new Date(validateData.release_at)},
        ${validateData.stock},
        ${new Date(validateData.updated_at)},
        ${validateData.metacritic},
        ${publicUrl.publicUrl}
      )
      RETURNING *
    `;

    return Response.json(
      {
        success: true,
        message: "Game created successfully",
        url: data?.path,
        game: game[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { success: false, error: "Error uploading the image or creating game" },
      { status: 500 }
    );
  }
}
