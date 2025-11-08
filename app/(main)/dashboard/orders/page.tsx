import { cookies } from "next/headers";
import { MainOrders } from "./(component)/MainOrders";
import { Suspense } from "react";
import { Spinner } from "@heroui/react";

export default async function PageOrders(){

      const cookieStore =await cookies();
    
    const ordersResponse= await fetch(`${process.env.NEXT_LOCAL_URL}/api/checkout`,{
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