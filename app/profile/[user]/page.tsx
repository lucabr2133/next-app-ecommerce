import { auth, User } from "@/auth"
import { MainProfile } from "./(component)/mainProfile"
import { sql } from "@/supabase"
export default async function profilePage() {
    const session=await auth()
    if(!session?.user?.name)  throw new Error("User not authenticated");

    const [userData]=await sql<User[]> `select * from users where username=${session?.user?.name}`
    return <>
    <MainProfile user={userData}></MainProfile>
    </>
    
    
}