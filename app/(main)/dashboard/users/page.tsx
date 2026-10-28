import { sql } from "@/supabase";
import UsersTable from "@/components/dashboardComponents/users/usersTable";
import { User } from "@/auth";

export const dynamic = "force-dynamic";

export default async function PageUsers() {
  const users = await sql<User[]>`SELECT * FROM users ORDER BY id ASC`;

  return <UsersTable users={users} />;
}
