import { auth } from "@/auth";
import { cookies } from "next/headers";
import { MainOrders } from "./(component)/MainOrders";

export default async function PageOrders(){

      const cookieStore =await cookies();
    
    const ordersResponse= await fetch('http://localhost:3000/api/checkout',{
        headers:{
            Cookie: cookieStore.toString()
        }
    })
    const dataResponse= await ordersResponse.json()
    console.log(dataResponse);
    
    return <>
        <h2>Orders Page</h2>
        <MainOrders orders={dataResponse}>

        </MainOrders>
    </>
}