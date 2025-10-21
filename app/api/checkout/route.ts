import { sql } from "@/supabase"
import { Games } from "@/types/database";
 function generateKey(){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key=''
        const keyLength = 15; 
    for (let i = 0; i < keyLength; i++) {
        const element = chars[Math.floor(Math.random() * chars.length)];
        key+=element
    }
    return key
 }
// export  function GET(request:Request){
//     const order=   ''  
//     return Response.json({
//     })
// }
export async  function POST(request:Request){
    const body= await request.json()
    const {games,userId,status}:{games:Games[],userId:string ,status:string  }=body
 
    const order=await sql `insert into orders (user_id,status) values (${userId},${status}) returning id `
    for (const game of games) {
        const key=generateKey()
         await sql `insert into order_items (game_id,order_id,code_key,quantity) values(
            ${game.id},${order[0].id},${key},1
         )`
    }
    
    return new Response(JSON.stringify({
  orderId: order[0].id,
}), { status: 200 })
}

