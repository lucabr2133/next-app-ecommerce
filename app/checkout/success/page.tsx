import { HomeSuccess } from "./(component)/homeSuccest"

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }){
    const {orderId}=await searchParams
    
    const orderRequest= await fetch(`http://localhost:3000/api/checkout/success?orderId=${orderId}`)
    const orderData= await orderRequest.json()
    return<>
        <HomeSuccess orderData={orderData}></HomeSuccess>
    </>
}