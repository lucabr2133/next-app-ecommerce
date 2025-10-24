"use client"
import { Games } from "@/types/database";
import { ShopCart } from "@/UI/Components/CartItem";
import { Button, DateInput, DatePicker, Form,Input, Select, SelectItem, Spacer} from "@heroui/react"
import {getLocalTimeZone, today} from "@internationalized/date";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function FormComponent({games}:{games:Games[]}){
  async function handleCreateOrder() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        games,
        status: "pending",
      }),
    });
    const data = await res.json();
    return data.orderId; // devolver id para usarlo en el pago
  }

  async function handleFakePayment(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const orderId = await handleCreateOrder();

    // Simulamos que el pago se completó exitosamente:
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    router.push(`/checkout/success?order=${orderId}`);
  }
    const [step,setStep]=useState(0)
    const path=usePathname()
    const router=useRouter()
    const countrys=[
        {key:'argentina',label:"Argentina"},
        {key:'spain',label:"Spain"},
        {key:'united states',label:"United States"},
        {key:'united kindomg',label:"United kindomg"},
        {key:'germany',label:"Germany"},
        {key:'french',label:"French"},
        {key:'Italy',label:"Italy"},
        {key:'mexico',label:"Mexico"},



        

        


    ]
    return <>
   {step===0 &&<main className="p-32 flex items-center flex-col">
    Pay Method
    <Spacer ></Spacer>
    <Form className="w-full max-w-1/3 flex flex-col gap-4 p-3 border-1 rounded-2xl" onSubmit={async(e)=>{
        e.preventDefault()
        setStep(1)
      
        
    }} >
        <div className="flex flex-row gap-3">
        <Input label='Name' labelPlacement="outside-top" name="Name" placeholder="Enter your Name" type="text" isRequired></Input>
        <Input label='Surname' labelPlacement="outside-top" name="Surname" placeholder="Enter your Surname" type="text" isRequired></Input>

        </div>
        <Input label='Locality' labelPlacement="outside-top" name="Locality" placeholder="Enter your Locality" type="text" isRequired></Input>
        <Input label='Direction' labelPlacement="outside-top" name="Direction" placeholder="Enter your Direction" type="text" isRequired></Input>
       
        <Input label='Postal code' labelPlacement="outside-top" name="Postal code" placeholder="Enter your Postal code" type="text" isRequired></Input>
        <Select items={countrys} placeholder="Select a Country" label="Country" isRequired>
            {(country) => <SelectItem>{country.label}</SelectItem>}
        </Select>
        <Spacer></Spacer>
        <Button type="submit" color="primary">Continue</Button>
        
      


     </Form>
    </main>}  
    {step===1&& <main className="p-5 grid grid-cols-2 w-full gap-5">
        <div className="border rounded-2xl p-5">
            <h6>
            OrderReview
        </h6>
        <section className="">
            {games.map(game=>(

                <ShopCart key={game.id} game={game}></ShopCart>
            ))}
        </section>
        </div>
      
        <Form className="w-1/2 flex flex-col gap-4 p-3  rounded-2xl " onSubmit={handleFakePayment}>
        <h2>Payment</h2>
        <DatePicker minValue={today(getLocalTimeZone())}></DatePicker>
        <Input label='Security Code' labelPlacement="outside-top" name="Security Code" placeholder="Enter your Security Code" type="text" isRequired></Input>
          <div className="flex gap-5">
   <Button type="submit" color="primary" onPress={()=>{
            setStep(0)
        }}>Back</Button>

        <Button  type="submit" color="primary">Pay</Button>
          </div>
       
        </Form>
      

        </main>}
 
    </>
}