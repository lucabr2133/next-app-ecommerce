import { auth } from "@/auth";
import { sql } from "@/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId } = await params;
  const { role } = await request.json();

  if (!userId || !role || !["admin", "user"].includes(role)) {
    return Response.json({ error: "Invalid data provided" }, { status: 400 });
  }

  try {
    await sql`UPDATE users SET role=${role} WHERE id=${userId}`;

    return Response.json({ message: "User role updated" }, { status: 200 });
  } catch (e) {
    console.error(e);

    return Response.json({ error: "Failed to update user" }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();

  if (session?.user?.role !== "admin") {
    return Response.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { userId } = await params;
  const { isActive } = await request.json();

  if (!userId || typeof isActive !== "boolean") {
    return Response.json({ error: "Data is missing" }, { status: 400 });
  }

  try {
    await sql`UPDATE users SET is_active=${isActive} WHERE id=${userId}`;

    return Response.json(
      { message: "User updated successfully" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);

    return Response.json(
      { error: "Failed to update the user" },
      { status: 400 }
    );
  }
}
