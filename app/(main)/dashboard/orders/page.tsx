import { cookies } from "next/headers";
import { MainOrders } from "./(component)/MainOrders";
import { Suspense } from "react";
import { Spinner } from "@heroui/react";

export default async function PageOrders(){

      const cookieStore =await cookies();
    const url=process.env.NEXT_PUBLIC_API_URL
    
    const ordersResponse= await fetch(`${url}/api/checkout`,{
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