import { auth } from "@/auth";
import { sql } from "@/supabase";
import { Games } from "@/types/database";
export async function GET(request:Request) {
    const session=await auth()
    
if (!session?.user?.id) {
  throw new Error("User not authenticated");
}
    const [userCart]= await sql `Select * from carts where user_id=${session?.user?.id}`
    if(!userCart){
        await sql `insert into carts (user_id) values(${session.user.id})`
    }
    const cartList=await sql `select games.* from games inner join carts_games cg on games.id=cg.game_id  where cg.cart_id=${userCart.id}`
   return Response.json(cartList)
}
export async function DELETE(request:Request) {
      const session=await auth()
if (!session?.user?.id) {
  throw new Error("User not authenticated");
}

    const body=await request.json()
    const userCart= await sql `Select * from carts where user_id=${session.user.id}`

    const {gameId}=body
    const deleteGameCart= await sql `DELETE  FROM carts_games where game_id=${gameId} and cart_id=${userCart[0].id}`
    
   return Response.json({message:'Delete succesfully'})

}
export async function POST(request:Request) {
       const session=await auth()
if (!session?.user?.id) {
  throw new Error("User not authenticated");
}
      const body = await request.json(); 
    const {game}=body
    const userCart= await sql `Select * from carts where user_id=${session.user.id}`
    await sql`insert into  carts_games (cart_id,game_id,quantity) values(
        ${userCart[0].id},${game.id},1
    )`
   return Response.json({message:'succesfull'})

    
}