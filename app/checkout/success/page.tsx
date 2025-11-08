import { cookies } from "next/headers"
import { HomeSuccess } from "./(component)/homeSuccest"

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }){
    const {orderId}=await searchParams
    const cookie=await cookies()
    const orderRequest= await fetch(`http://localhost:3000/api/checkout/success?orderId=${orderId}`,{
        headers:{
            Cookie:cookie.toString()
        }
    })
    const orderData= await orderRequest.json()
    console.log(orderData);
    
    return<>
        <HomeSuccess orderData={orderData}></HomeSuccess>
    </>
}