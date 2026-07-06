import { auth, User } from "@/auth"
import { MainProfile } from "@/components/profileComponents/mainProfile"
import { sql } from "@/supabase"
import { redirect } from "next/navigation";

export default async function ProfilePage(props: { params: Promise<{ user: string }> }) {
    await props.params;
    const session = await auth()
    
    if(!session?.user?.name || !session?.user?.id ) {
        redirect('/login')
    }
    
    const users = await sql<User[]>`select * from users where users.id = ${session.user.id}`
    const userData = users[0];
    
    if (!userData) {
        redirect('/login')
    }
    
    const orderData = await sql`select * from orders inner join order_items on orders.id = order_items.order_id where orders.user_id = ${session.user.id}`
    
    return (
        <MainProfile user={userData} orderData={orderData} />
    )
}