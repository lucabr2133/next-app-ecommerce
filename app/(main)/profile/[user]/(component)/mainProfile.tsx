"use client"
import { User } from "@/auth";
import { Button, Card, CardBody, CardHeader, Divider, Image ,Link} from "@heroui/react";
import { Check, LucideBookDown, UserCircle2Icon } from "lucide-react";

export function MainProfile({user,orderData}:{user:User,orderData:[]}) {
    return <>
        <main className="bg-gradient-to-b   from-gray-950  to-gray-900 h-screen flex items-center flex-col gap-5  ">
          <div className="w-full md:w-1/2 flex gap-5 items-center border-1  rounded-2xl">
                <UserCircle2Icon width={150} height={159}/>
                <h2 className="text-center capitalize text-3xl">{user.username}</h2>
            </div>
            <Card className="bg-black md:h-1/2 md:w-1/2 border-1 ">
                <CardHeader className="">
                      <h2>My orders</h2>
                        
                </CardHeader>
                <Divider></Divider>
                <CardBody className="">
            <div className="w-full flex flex-col  ">
            {orderData==undefined&&<>No orders data</>}
            {orderData.map((order)=>(
                  <div key={order.order_id} className="w-full p-5 flex flex-col ">
                    <div className="w-full p-5 flex justify-between items-center ">
                        <Check color="#0F0"></Check>
                    <h2>
                    {order.id}
                    </h2>
                    <div>
                        <Button color="primary" variant="flat" as={Link} href={`/checkout/success?orderId=${order.order_id}`}>View Details</Button>
                    </div>
                    </div>
                    <Divider></Divider>
                

                </div>
              
            ))}
            </div>
                </CardBody>
            </Card>
        </main>
           </>
}