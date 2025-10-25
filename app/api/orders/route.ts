import { auth } from "@/auth";
import { sql } from "@/supabase";
export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ error: "User not authenticated" }), {
        status: 401,
      });
    }

    let [userCart] = await sql`
      SELECT * FROM carts WHERE user_id = ${session.user.id}
    `;

    if (!userCart) {
      [userCart] = await sql`
        INSERT INTO carts (user_id)
        VALUES (${session.user.id})
        RETURNING *
      `;
    }

    const cartList = await sql`
      SELECT g.*
      FROM games g
      INNER JOIN carts_games cg ON g.id = cg.game_id
      WHERE cg.cart_id = ${userCart.id}
    `;

    return Response.json(cartList);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
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