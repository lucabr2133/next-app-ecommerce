import { auth } from "@/auth";
import { sql } from "@/supabase";
import { error } from "console";

export async function PATCH(request:Request,{params}:{params:Promise<{orderId:string}>}) {
  const session=await auth()
  if(!session?.user)return Response.json({error:'Unauthorized'},{status:403})
    const body= await request.json()
    const {status}=body
    if(!status) return Response.json({error:'No status provided'},{status:400})
    const {orderId}= await params
  if(!orderId) return Response.json({error:'no order Id provided'},{status:400})
    try {
    const row=await sql`update orders set status = ${status} where id = ${orderId } returning *`;
    await sql` DELETE FROM cart_items WHERE user_id = ${row[0].user_id}`
    return Response.json({
    succes:true,
    message:'Order update',
    order:row[0]
  })
    } catch (e) {
      return Response.json({error:'fail to update order'},{status:400})
    }
    

    
}