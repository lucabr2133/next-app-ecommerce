import { sql } from "@/supabase";
import { Games } from "@/types/database";
export async function GET(request:Request) {
    const userId='8ba23927-2689-4864-bb4c-378816e01c18'
    const userCart= await sql `Select * from carts where user_id=${userId}`

    const cartList=await sql `select games.* from games inner join carts_games cg on games.id=cg.game_id  where cg.cart_id=${userCart[0].id}`
   return Response.json(cartList)
}
export async function DELETE(request:Request) {
    
}
export async function POST(request:Request) {
    const userId='8ba23927-2689-4864-bb4c-378816e01c18'
      const body = await request.json(); 
    const {game}=body
    const userCart= await sql `Select * from carts where user_id=${userId}`
    await sql`insert into  carts_games (cart_id,game_id,quantity) values(
        ${userCart[0].id},${game.id},1
    )`
   return Response.json({message:'succesfull'})

    
}