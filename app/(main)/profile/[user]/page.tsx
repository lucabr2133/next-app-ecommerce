import { auth, User } from "@/auth"
import { MainProfile } from "@/components/profileComponents/mainProfile"
import { sql } from "@/supabase"
export default async function profilePage() {
    const session=await auth()
    if(!session?.user?.name ||!session?.user?.id )  throw new Error("User not authenticated");
    
    const [userData]=await sql<User[]>`select * from users where users.id=${session.user.id}`
    const orderData=await sql `select * from orders inner join order_items on orders.id=order_items.order_id where orders.user_id=${session.user.id}`
    
    
    return <>
    <MainProfile user={userData} orderData={orderData}></MainProfile>
    </>
    
    
}