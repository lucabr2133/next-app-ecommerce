import bcrypts from "bcryptjs";

import { auth } from "@/auth";
import { sql } from "@/supabase";

export async function POST(request: Request) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { username, password, email } = await request.json();

    if (!username || !password || !email) {
      return Response.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    const hashPassword = await bcrypts.hash(password, 10);
    const [user] = await sql`
      INSERT INTO users (username, role, email, password)
      VALUES (${username}, 'admin', ${email}, ${hashPassword})
      RETURNING id, username, email, role
    `;

    return Response.json(
      { message: "Admin created successfully", user },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);

    return Response.json(
      { error: "Something unexpected happened" },
      { status: 400 }
    );
  }
}
