import { HomeSuccess } from "./(component)/homeSuccest"

export default async function Page({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }){
    
    const orderRequest= await fetch(`http://localhost:3000/api/checkout/success?orderId=${searchParams.order}`)
    const orderData= await orderRequest.json()
    return<>
        <HomeSuccess orderData={orderData}></HomeSuccess>
    </>
}