import { auth } from "@/auth"
import { sql } from "@/supabase"

export async function GET (request:Request){
    const session=await auth()
    
    if(!session?.user)return Response.json({error:'Unauthorized'},{status:404})
    const url= new URL(request.url)
    const orderId=url.searchParams.get('orderId')
    
        if(!orderId) return Response.json('no orderId provided',{status:400})
    try {
    const gameKeys=await sql`select * from orders o inner join order_items oi on oi.order_id=o.id inner join games g on g.id=oi.game_id where o.id=${orderId}`
    
    return Response.json(gameKeys,{status:200})
        
    } catch (error) {
        console.error(error);
        
        Response.json({error},{status:404})
    }

}