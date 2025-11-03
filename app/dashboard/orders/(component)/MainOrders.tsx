"use client"
import { Table, TableBody, TableColumn,TableCell,TableHeader,TableRow, Divider, Card, CardHeader, CardBody, CardFooter, Button, Chip, Modal, ModalContent, ModalBody, useDisclosure, ModalHeader, Form, Image, ModalFooter } from "@heroui/react";
import { Car } from "lucide-react";
import postgres from "postgres";
import { useCallback, useState } from "react";

export function MainOrders({orders}:{orders:postgres.Row[]}){
    const {isOpen,onOpen,onOpenChange} =useDisclosure()
    const [currentOrder,setCurrentOrder]=useState<postgres.Row|null>(null)
    const [currentGames,setCurrentGames]=useState<postgres.Row[]|null>(null)
    const renderCell=useCallback((order:postgres.Row,columkey:string)=>{
        const cell=order[columkey]
        switch (columkey){
            case 'id':
                return <div >{cell}</div>
            case 'user_id':
                return <div>{cell}</div>
            case 'status':
                return <div>{cell}</div>
            case 'created_at':
                return <div>{cell}</div>
            case 'username':
                return <div>{cell}</div>
            case 'action':
                return <div className="flex gap-4 w-full">
                    <Button color="primary" variant="flat" onPress={async()=>{
                        setCurrentOrder(order)
                        onOpen()
                        const gamesOrder= await fetch(`http://localhost:3000/api/checkout/success?orderId=${order?.id}`)
                        const dataGames= await gamesOrder.json()
                        console.log(dataGames);
                        
                        setCurrentGames(dataGames)
                    }}>View Details</Button>

                </div>
        }

    },[orders])
    const keys=Object.keys(orders[0])
    keys.push('action')

return (
  <main className="min-h-screen w-full flex flex-col px-10 py-8 gap-8 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
    {/* Header */}
    <div className="flex items-center justify-between">
      <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-100">
        Orders
      </h2>
      <button className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition">
        + New Order
      </button>
    </div>

    <Divider className="opacity-70" />

    {/* Table Container */}
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-800">
      <Table
        aria-label="Orders Table"
        className="w-full"
        isStriped
        removeWrapper
      >
        <TableHeader>
          {keys.map((key) => (
            <TableColumn
              key={key}
              className="uppercase text-xs font-semibold tracking-wider text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800"
            >
              {key}
            </TableColumn>
          ))}
        </TableHeader>

        <TableBody emptyContent={"No orders found"} items={orders}>
          {(item) => (
            <TableRow
              key={item.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
            >
              {(columnKey) => (
                <TableCell className="p-5 text-gray-700 dark:text-gray-200">
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
<Modal onOpenChange={onOpenChange} isOpen={isOpen} onClose={()=>{
    setCurrentOrder(null)
}}>
        <ModalContent className="min-w-1/2 min-h-3/4">
            {(onclose)=>(
                <>
                <ModalHeader>
                      <div className="flex gap-5 justify-between w-full">
                    Order details
                    
                    <h2>Id: {currentOrder?.id}</h2>
                    <h2>Date: {new Date(currentOrder?.created_at).toLocaleDateString()}</h2>
                   
               </div>
                    </ModalHeader>
             <Divider></Divider>

                <ModalBody className="h-full">
                   <div key={currentOrder?.id} className="flex flex-col gap-5">
                    <span className="flex  flex-col items-center">
       
                        <h2  className="text font-extrabold uppercase text-3xl" >User:  {currentOrder?.username}</h2>
                    </span>
                    <span className="flex gap-5 flex-col">
                        {currentGames?.map(game=>(
                            <Card key={game.id} className=" bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 border-1" >
                                <CardBody className="flex w-full flex-row  gap-5">
                                    <Image width={400}   src={game.img_url}></Image>
                                    <div className="flex flex-col w-full">
                                    <div className="flex justify-between h-full w-full ">
                                        <h2 className="text font-extrabold uppercase text-2x1">{game.title}</h2>
                                        <h2 className="text font-extrabold uppercase text-2x1">${game.price}</h2>
                                        
                                    </div>
                                    <div className="flex justify-between">
                                        <h2>Game key:</h2>
                                        <Chip color="success" variant="flat"> {game.code_key}</Chip>
                                    </div>
                                    </div>
                                 
                                </CardBody>
                            </Card>
                        ))}
                    </span>
      

          
                    </div>
                    <Divider></Divider>
                </ModalBody>
                <ModalFooter className="w-full">
                      <div className="p-6 flex flex-col gap-5 w-full">
                        <div className="flex justify-between w-full">
                        <h2 className=" uppercase text-2xl">Status:</h2>
                         <Chip color="success" variant="flat">
                                    {currentOrder?.status}
                        </Chip>

                    </div>

                    <div className="w-full flex justify-between">
                        <h2 className=" uppercase text-2xl">Total:</h2>

                        <h2>Total Order: ${currentGames?.reduce((prev,current)=>prev+parseFloat(current.price),0)}</h2>

                    </div>
                    </div>
                </ModalFooter>
                
                </>
            
            )}
        </ModalContent>
    </Modal>

  </main>
);

}
//        <div className="grid grid-cols-3 gap-5">
//  {orders.map(order=>{
//         return <Card key={order.id}>
//             <CardHeader className="flex justify-between ">
//                 <div className="flex gap-5 ">
                    
//                     <h2>{order.id}</h2>
//                     <h2>{new Date(order.created_at).toLocaleDateString()}</h2>
                    
//                 </div>
//                 <Chip color="success" variant="flat">
//                 {order.status}

//                 </Chip>
//             </CardHeader>
//             <Divider></Divider>
//             <CardBody>
//                 {order.username}
//             </CardBody>
//             <CardFooter>
//                 <Button variant="flat" color="success">
//                     View Details
//                 </Button>
//             </CardFooter>
//         </Card>
//        })}
//        </div>