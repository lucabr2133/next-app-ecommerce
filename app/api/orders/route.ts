import { auth } from "@/auth";
import { sql } from "@/supabase";

async function getOrCreateUserCart(userId: string) {
  let [userCart] = await sql`
    SELECT * FROM carts WHERE user_id = ${userId}
  `;

  if (!userCart) {
    [userCart] = await sql`
      INSERT INTO carts (user_id)
      VALUES (${userId})
      RETURNING *
    `;
  }

  return userCart;
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json([], { status: 200 });
    }

    const userCart = await getOrCreateUserCart(session.user.id);

    const cartList = await sql`
      SELECT g.*
      FROM games g
      INNER JOIN carts_games cg ON g.id = cg.game_id
      WHERE cg.cart_id = ${userCart.id}
    `;

    return Response.json(cartList);
  } catch (error) {
    console.error("Error fetching cart:", error);

    return Response.json([], { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const userCart = await getOrCreateUserCart(session.user.id);

    if (body.clearAll) {
      await sql`
        DELETE FROM carts_games WHERE cart_id = ${userCart.id}
      `;

      return Response.json({ message: "Cart cleared successfully" });
    }

    const { gameId } = body;

    if (!gameId) {
      return Response.json({ error: "No gameId provided" }, { status: 400 });
    }

    await sql`
      DELETE FROM carts_games
      WHERE game_id = ${gameId} AND cart_id = ${userCart.id}
    `;

    return Response.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting from cart:", error);

    return Response.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return Response.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { game } = body;

    if (!game?.id) {
      return Response.json({ error: "No game provided" }, { status: 400 });
    }

    const userCart = await getOrCreateUserCart(session.user.id);

    const existing = await sql`
      SELECT * FROM carts_games
      WHERE cart_id = ${userCart.id} AND game_id = ${game.id}
    `;

    if (existing.length === 0) {
      await sql`
        INSERT INTO carts_games (cart_id, game_id, quantity)
        VALUES (${userCart.id}, ${game.id}, 1)
      `;
    }

    return Response.json({ message: "Added to cart successfully" });
  } catch (error) {
    console.error("Error adding to cart:", error);

    return Response.json(
      { error: "Failed to add item to cart" },
      { status: 500 }
    );
  }
}
