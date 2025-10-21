import { sql } from "@/supabase"

export async function GET (request:Request,{params}:{params:{orderId:string}}){
    const url= new URL(request.url)
    const orderId=url.searchParams.get('orderId')
    
    const gameKeys=await sql`select * from orders o inner join order_items oi on oi.order_id=o.id inner join games g on g.id=oi.game_id where o.id=${orderId}`

    return Response.json(gameKeys)
}