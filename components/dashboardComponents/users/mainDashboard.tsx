"use client"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Table,TableBody,TableHeader,TableColumn, TableCell, TableRow, Image } from "@heroui/react";
import { data } from "../../../app/(main)/dashboard/page";
import { Row } from "postgres";
import SalesChart from "./salesChart";

export  function MainDashboard({data}:{data:data,}) {
    const {totalUser,totalGames,totalOrders,sales,mostSellGames,totalEarnigs}=data
    
    return <>
    
     <main className="h-screen p-2 md:p-10 w-[100vw] flex flex-col gap-5 ">
        <header>
        <h2 className="uppercase font-extrabold text-3xl">Main Dashboard</h2>
        <Divider></Divider>
        <div className="">

        </div>
        </header>
     

        <div className=" lg:grid lg:grid-cols-3 lg:grid-rows-2 w-full gap-5 flex flex-col">
             <ul className="col-start-1 col-end-3 xl:grid-cols-2 xl:grid-rows-2 xl:grid flex flex-wrap *:flex-1 gap-5 *:text-white ">
                    <Card className="min-w-[300] bg-gradient-to-r from-[#4b857d]  to-[#03a48e]  rounded-none  ">
                        <CardBody className=" justify-center  p-10 flex gap-5  ">
                            Total Users
                            
                            <h2 className="text-4xl">{totalUser.count}</h2>
                        </CardBody>
                        <CardFooter className="flex justify-start md:justify-end p-1">
                            <Button  as={Link} href="/dashboard/users" variant="light" size="md" className="text-white">More info</Button>
                        </CardFooter>
                    </Card>
                    
                      <Card className="min-w-[300] bg-gradient-to-r  from-[#ef4444] to-[#f97316] rounded-none">
                        <CardBody className=" justify-center  p-10 flex gap-5  ">
                            Total Orders
                            
                            <h2 className="text-4xl">{totalOrders.count}</h2>
                        </CardBody>
                        <CardFooter className="flex justify-start md:justify-end p-1">
                            <Button  as={Link} href="/dashboard/users" variant="light" size="md" className="text-white">More info</Button>
                        </CardFooter>
                    </Card>
                     <Card className="min-w-[300]  bg-gradient-to-r from-[#213257]  to-[#1a48b3] rounded-none">
                        <CardBody className=" justify-center  p-10 flex gap-5  ">
                            Total Games
                            
                            <h2 className="text-4xl">{totalGames.count}</h2>
                        </CardBody>
                        <CardFooter className="flex justify-start md:justify-end p-1">
                            <Button  as={Link} href="/dashboard/users" variant="light" size="md" className="text-white">More info</Button>
                        </CardFooter>
                    </Card>
                    <Card className="min-w-[300] bg-gradient-to-l from-[#41600a]   to-[#547d0f] rounded-none">
                        <CardBody className=" justify-center  p-10 flex gap-5  ">
                            Total Games
                            
                            <h2 className="text-4xl">${totalEarnigs.sum}</h2>
                        </CardBody>
                        <CardFooter className="flex justify-start md:justify-end p-1">
                            <Button  as={Link} href="/dashboard/users" variant="light" size="md" className="text-white">More info</Button>
                        </CardFooter>
                    </Card>
              
            </ul>
            <div className="col-start-3 row-start-1 row-end-3 flex gap-2 flex-col ">
                <h2 className="text-center text-3xl">TOP SELL GAMES</h2>
                <div className=" w-full grid  gap-5 p-10  rounded-2xl">
  {mostSellGames.map((game)=>(
                    <Card key={game.id} className="w-full   rounded-none" >
                        
                        <CardBody className="w-full flex flex-row text-center   items-center gap-5 " >
                            <Image  className="w-[260px]" src={game.img_url}></Image>
                            <div className="flex flex-1 justify-between  items-center w-full">
                            <h2 className="uppercase font-extrabold">
                            {game.title}

                            </h2>
                            <h2 className=" rounded-full p-2 w-[40px] h-[40px] bg-amber-100/40 ">{game.count}</h2>
                            </div>
                            
                        </CardBody>
                   
                    
                    </Card>
                ))}
                </div>
              
            </div>
                    <SalesChart data={sales}></SalesChart>
        </div>
  
           

        </main>
    </>
    
}