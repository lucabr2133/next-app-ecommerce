import { createClient } from "@supabase/supabase-js";
import z from "zod";

import { validateUpdateFormSchema } from "@/app/(main)/schemas";
import { auth } from "@/auth";
import { sql } from "@/supabase";

const supabase = createClient(
  (process.env.SUPABASE_URL || "https://placeholder.supabase.co") as string,
  (process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder") as string
);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ idGames: string }> }
) {
  const { idGames } = await params;

  try {
    const game = await sql`
      SELECT games.id, games.title, games.img_url, games.description, games.price
      FROM games
      WHERE games.id = ${idGames}
    `;

    if (game.length === 0) {
      return Response.json({ error: "Game not found" }, { status: 404 });
    }

    const tags = await sql`
      SELECT new_tags_game.tag_id AS tag_id, new_tags.name AS tag_name
      FROM new_tags_game
      INNER JOIN new_tags ON tag_id = new_tags.id
      WHERE new_tags_game.game_id = ${game[0].id}
    `;
    const screenshots = await sql`
      SELECT DISTINCT screenshoots.id, screenshoots.screenshoot_url AS screenshot_url
      FROM screenshoots
      INNER JOIN screenshoots_game ON screenshoots_game.screenshoot_id = screenshoots.id
      WHERE screenshoots_game.game_id = ${game[0].id}
    `;

    return Response.json({ game, tags, screenshots });
  } catch (e) {
    console.error(e);

    return Response.json(
      { error: "Failed to fetch game details" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idGames: string }> }
) {
  const { idGames } = await params;
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }
  if (!idGames) {
    return Response.json({ error: "No idGame provided" }, { status: 400 });
  }

  try {
    const [game] = await sql`
      DELETE FROM games WHERE id = ${idGames} RETURNING *
    `;

    return Response.json(
      { message: "Game deleted successfully", game },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ idGames: string }> }
) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }
  const { idGames } = await params;

  if (!idGames) {
    return Response.json({ error: "No idGame provided" }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const validFormSchema = validateUpdateFormSchema(formData);

  if (!validFormSchema.success) {
    const flatterSchema = z.flattenError(validFormSchema.error);

    return Response.json(
      { errors: flatterSchema.fieldErrors, success: false },
      { status: 400 }
    );
  }

  try {
    const validateData = validFormSchema.data;
    let imageUrl: string | null = null;

    if (file && file.size > 0) {
      const filePath = `updated/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("games")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("games")
        .getPublicUrl(filePath);

      imageUrl = publicUrl.publicUrl;
    }

    const [game] = imageUrl
      ? await sql`
          UPDATE games
          SET title = ${validateData.title},
              stock = ${validateData.stock},
              description = ${validateData.description},
              metacritic = ${validateData.metacritic},
              updated_at = ${validateData.updated_at},
              price = ${validateData.price},
              img_url = ${imageUrl}
          WHERE id = ${idGames}
          RETURNING *
        `
      : await sql`
          UPDATE games
          SET title = ${validateData.title},
              stock = ${validateData.stock},
              description = ${validateData.description},
              metacritic = ${validateData.metacritic},
              updated_at = ${validateData.updated_at},
              price = ${validateData.price}
          WHERE id = ${idGames}
          RETURNING *
        `;

    return Response.json(
      { message: "Game updated successfully", success: true, game },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to update the game", success: false },
      { status: 400 }
    );
  }
}
