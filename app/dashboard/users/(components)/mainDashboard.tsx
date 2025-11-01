"use client"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@heroui/react";
import { data } from "../../page";

export  function MainDashboard({data}:{data:data}) {
    const {totalUser,totalGames,totalOrders}=data
    return <>
    
     <main className="h-screen p-24 w-full flex flex-col gap-5">
        <h2 className="uppercase font-extrabold text-3xl">Main Dashboard</h2>
    <Divider></Divider>
            <ul>
                <div className="flex w-full gap-5">
                    <Card className="min-w-[300] bg-blue-600 ">
                        <CardHeader>
                            Total Users:
                        </CardHeader>
                        <Divider></Divider>
                        <CardBody className="flex justify-center   ">
                            
                            <h2 className="text-5xl">{totalUser.count}</h2>
                        </CardBody>
                        <Divider></Divider>
                        <CardFooter className="flex justify-end p-1">
                            <Button  as={Link} href="/dashboard/users" variant="light" size="sm">More info</Button>
                        </CardFooter>
                    </Card>
                    
                     <Card className="min-w-[300] bg-green-800  ">
                        <CardHeader>
                            Total Games:
                        </CardHeader>
                        <Divider></Divider>
                        <CardBody className="flex justify-center   ">
                            
                            <h2 className="text-5xl">{totalGames.count}</h2>
                        </CardBody>
                        <Divider></Divider>
                        <CardFooter className="flex justify-end p-1">
                            <Button  as={Link} href="/dashboard/games" variant="light" size="sm">More info</Button>
                        </CardFooter>
                    </Card>
                      <Card className="min-w-[300] ">
                        <CardHeader>
                            Total orders:
                        </CardHeader>
                        <Divider></Divider>
                        <CardBody className="flex justify-center p-10   ">
                            
                            <h2 className="text-5xl">{totalOrders.count}</h2>
                        </CardBody>
                        <Divider></Divider>
                        <CardFooter className="flex justify-end p-1">
                            <Button as={Link} href="/dashboard/orders" variant="light" size="sm">More info</Button>
                        </CardFooter>
                    </Card>
                </div>
              
            </ul>

        </main>
    </>
    
}