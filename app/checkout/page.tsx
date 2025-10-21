import { Games } from "@/types/database";
import FormComponent from "./(components)/Form";

export default async function Page(){
    const res=await fetch('http://localhost:3000/api/orders')
    const cartList:Games[]= await res.json()
    
    return <>
    <FormComponent games={cartList}></FormComponent>
    </>
}