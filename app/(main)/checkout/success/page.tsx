import { cookies } from "next/headers"
import { HomeSuccess } from "./(component)/homeSuccest"

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }){
    const {orderId}= await searchParams
    const cookie=await cookies()
    const url=process.env.NEXT_PUBLIC_API_URL
    
    const orderRequest= await fetch(`${url}/api/checkout/success?orderId=${orderId}`,{
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