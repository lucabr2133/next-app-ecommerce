import { sql } from "@/supabase"
import UsersTable from "@/components/dashboardComponents/users/usersTable"
import { User } from "@/auth";

export default async function pageUsers(){
    const users = await sql<User[]>`select * from users`
    return <UsersTable users={users} />
}