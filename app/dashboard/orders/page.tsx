import { auth } from "@/auth";
import { cookies } from "next/headers";
import { MainOrders } from "./(component)/MainOrders";

export default async function PageOrders(){

      const cookieStore =await cookies();
    
    const ordersResponse= await fetch('api/checkout',{
        headers:{
            Cookie: cookieStore.toString()
        }
    })
    const dataResponse= await ordersResponse.json()
    
    return <>
        <MainOrders orders={dataResponse}>

        </MainOrders>
    </>
}