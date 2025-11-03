import { auth } from "@/auth";
import { stripe } from "@/services/stripe/config";
import { sql } from "@/supabase"
import { Games } from "@/types/database";
import { error } from "console";
import { NextResponse } from "next/server";


export async function GET(request:Request) {
     const session=await auth()
     
    if(session?.user?.role !=='admin'){
         throw new Error("User not authenticated");
    }
  try {
   const orders= await sql `select orders.* ,username from users  inner join orders on orders.user_id=users.id`
    return Response.json(orders,{status:200})
  } catch (error) {
    console.log(error);
    
    return Response.json({error},{status:400})
    
  }
   
    
}
export async function POST(request:Request) {
    const {games}=await request.json()
    const session=await auth()
  if(!session?.user?.id){
    
    return Response.json({error:'user not authenticathed'},{status:401})
  }
   const order = await sql`
    insert into orders (user_id, status)
    values (${session.user.id}, 'pending')
    returning id
  `;
     for (const game of games) {
         await sql `insert into order_items (game_id,order_id,code_key,quantity) values(
            ${game.id},${order[0].id},'',1
         )`
    }
  try
  {
const lineItems = games.map((game:Games) => ({
  price_data: {
    currency: "usd",
    unit_amount: Math.round(game.price * 100), // precio en centavos
    product_data: {
      
      name: game.title,
      description: game.description || "",
   images: game.img_url
        ? [game.img_url] // ✅ Debe ser un array de URLs absolutas
        : [],    
    },
  },
  quantity: 1,
}));

  // 3️⃣ Crear sesión en Stripe
  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `http://localhost:3000/checkout/success?orderId=${order[0].id}`,
    cancel_url: `http://localhost:3000/checkout/cancel`,
    metadata: {
      orderId: order[0].id.toString(),
      userId: session.user.id,
    },
  });
    return Response.json({ sessionId: stripeSession.id ,url:stripeSession.url});

  }catch(e){
    console.log(e,'a');
    return Response.json({ error }, { status: 400 });
  }
  
}

