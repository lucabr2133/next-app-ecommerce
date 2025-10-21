import { sql } from "@/supabase";

export async function PATCH(request:Request,{params}:{params:{orderId:string}}) {
    const body= await request.json()
    const {status}=body
    const {orderId}= await params
     const row=await sql`update orders set status = ${status} where id = ${orderId } returning *`;
 await sql`
    DELETE FROM cart_items WHERE user_id = ${row[0].user_id}
  `
  return Response.json({
    succes:true,
    message:'Order update',
    order:row[0]
  })
    
}