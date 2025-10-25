"use client";
import { Button, Card, CardBody, CardHeader, Chip, Divider, Spacer, Image, CardFooter } from "@heroui/react";
import { CheckCircle, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

export  function HomeSuccess({ orderData }: { orderData: any[] }) {
  const router = useRouter();

  if (!orderData || orderData.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white bg-black">
        <p>No hay información de la orden.</p>
      </main>
    );
  }

  const first = orderData[0]; // todos comparten la misma order_id, status, etc.
  const total = orderData.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  return (
    <main className=" min-h-screen flex flex-col place-items-center p-6 place-content-center bg-gradient-to-b gap-5  from-gray-950  to-gray-900">
            <div className="flex flex-col items-center">
               <CheckCircle className="w-16 h-16 text-green-500 mb-3" />
         <h1 className="text-3xl font-bold">¡Gracias por tu compra!</h1>
        <p className="text-gray-400 mt-1">Tu orden #{first.order_id} fue completada correctamente.</p>
            </div>
            <Card className="min-w-1/3 ">
                <CardHeader className="border-b border-gray-800">
                    <div className="flex justify-between w-full">
                      <h2 className="text-xl font-semibold">Detalles de tu orden</h2>
         <p className="text-gray-500 text-sm">
         Fecha: {new Date(first.created_at).toLocaleDateString()}
          </p>
                    </div>
                </CardHeader>
                <Divider></Divider>
                <CardBody className="flex gap-5">
                    {orderData.map(order=>(
                        <div key={order.id} className="bg-gray-900  p-2 rounded-2xl flex justify-between items-center">
                         <div className="">
                            <Image className="w-32" src={`${order.img_url}`}></Image>
                             <div>
                          <h3 className="text-lg font-medium">{order.title}</h3>
                      <p className="text-sm text-gray-400">${order.price}</p>
                          </div>
                           
                        </div>
                        <div className="flex justify-center items-center gap-2">
                            <span className=" font-mono text-green-400 tracking-wider text-sm">

                            {order.code_key}

                            </span>
                            <Button isIconOnly onPress={()=>{
                                handleCopy(order.code_key)
                            }} >
                                    <Copy></Copy>
                            </Button>
                            
                        </div>
                        </div>
                       
                       
                        
                    ))}
                </CardBody>
                <Divider></Divider>
                    <div className="p-6 flex flex-col gap-5">
                        <div className="flex justify-between w-full">
                        <h2>Stauts:</h2>
                         <Chip color="success" variant="flat">
                                    {first.status}
                        </Chip>

                    </div>

                    <div className="w-full flex justify-between">
                        <h2>Total:</h2>
                        <h2>${total}</h2>
                    </div>
                    </div>
                    
            </Card>
            <div className="flex justify-between w-1/3">
                <Button color="success" variant="flat" onPress={() => router.push("/")}>
                Volver al catálogo
                </Button>
                <Button variant="flat" onPress={() => router.push("/profile/orders")}>
                Ver mis compras
                </Button>

            </div>
    </main>
   
   
   
   
   
   
   
   
  );
}
