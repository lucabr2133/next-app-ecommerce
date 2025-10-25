import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Games } from "@/types/database";
import FormComponent from "./(components)/Form";

export default async function CheckoutPage() {

 

  // 🔑 Tomamos las cookies del request actual
  const cookieStore =await cookies();

  const res = await fetch("http://localhost:3000/api/orders", {
    headers: {
      Cookie: cookieStore.toString(), // reenviamos cookies al backend
    },
  });

  const cartList: Games[] = await res.json();
  
  return (
    <div>
      <h1>Checkout</h1>
      <FormComponent games={cartList}/>
    </div>
  );
}
