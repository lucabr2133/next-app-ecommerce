import { sql } from "@/supabase";
import { MainOrders } from "@/components/dashboardComponents/orders/MainOrders";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function PageOrders(){
    const session = await auth();
    
    if (session?.user?.role !== 'admin') {
        redirect('/');
    }
    
    const orders = await sql`select orders.*, username from users inner join orders on orders.user_id = users.id`;
    
    return <MainOrders orders={orders} />
}