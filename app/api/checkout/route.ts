import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import { sql } from "@/supabase"
import { Games } from "@/types/database";


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
 
  try
  {
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

  const stripeSession = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: lineItems,
    success_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout/success?orderId=${order[0].id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_API_URL}/checkout/cancel`,
    metadata: {
      orderId: order[0].id.toString(),
      userId: session.user.id,
    },
  });
    return Response.json({ sessionId: stripeSession.id ,url:stripeSession.url});

  }catch(e){
    console.error(e);
    return Response.json({ e }, { status: 400 });
  }
  
}

