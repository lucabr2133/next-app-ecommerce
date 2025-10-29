import { sql } from "@/supabase"
import UsersTable from "./(components)/usersTable"
import { User } from "@/auth";

export default async function pageUsers(){
    const users= await sql<User[]> `select * from users`
    return <>
        <main className="h-min-screen flex  w-full px-20 flex-col gap-36 py-5">
            <div>
            <h2 className="text-4xl font-extrabold uppercase">Users</h2>
 
            </div>
        <UsersTable users={users}></UsersTable>
        </main>
    </>
}