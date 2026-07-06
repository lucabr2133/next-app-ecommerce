"use client"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link, Image, Chip } from "@heroui/react";
import { data } from "../../../app/(main)/dashboard/page";
import { Row } from "postgres";
import SalesChart from "./salesChart";
import { Users, ShoppingCart, Gamepad2, CircleDollarSign, TrendingUp, ChevronRight } from "lucide-react";

export function MainDashboard({data}:{data:data}) {
    const {totalUser, totalGames, totalOrders, sales, mostSellGames, totalEarnigs} = data;
    
    return (
        <main className="min-h-screen max-w-7xl mx-auto p-4 md:p-10 w-full flex flex-col gap-8 bg-background relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-secondary/20 rounded-full blur-[100px] pointer-events-none -z-10" />

            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                        <TrendingUp className="text-primary w-6 h-6" />
                    </div>
                    <h2 className="font-bold text-3xl tracking-tight">Main Dashboard</h2>
                </div>
                <p className="text-default-500 text-sm pl-12">Overview of your store's performance</p>
                <Divider className="my-4" />
            </header>

            <div className="lg:grid lg:grid-cols-3 xl:grid-cols-4 w-full gap-6 flex flex-col">
                {/* Metrics Cards */}
                <ul className="col-span-3 xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 h-fit">
                    
                    {/* Total Users */}
                    <Card className="bg-content1/40 backdrop-blur-md border border-default-200/50 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                        <CardBody className="p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-500">
                                    <Users className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-default-500 font-medium text-sm">Total Users</p>
                                <h2 className="text-3xl font-bold tracking-tight mt-1">{totalUser.count}</h2>
                            </div>
                        </CardBody>
                        <CardFooter className="px-6 py-3 border-t border-default-200/50">
                            <Link href="/dashboard/users" className="text-teal-500 text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
                                View details <ChevronRight className="w-4 h-4" />
                            </Link>
                        </CardFooter>
                    </Card>
                    
                    {/* Total Orders */}
                    <Card className="bg-content1/40 backdrop-blur-md border border-default-200/50 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                        <CardBody className="p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-warning-500/10 text-warning-500">
                                    <ShoppingCart className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-default-500 font-medium text-sm">Total Orders</p>
                                <h2 className="text-3xl font-bold tracking-tight mt-1">{totalOrders.count}</h2>
                            </div>
                        </CardBody>
                        <CardFooter className="px-6 py-3 border-t border-default-200/50">
                            <Link href="/dashboard/orders" className="text-warning-500 text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
                                View details <ChevronRight className="w-4 h-4" />
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Total Games */}
                    <Card className="bg-content1/40 backdrop-blur-md border border-default-200/50 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                        <CardBody className="p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-500">
                                    <Gamepad2 className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-default-500 font-medium text-sm">Total Games</p>
                                <h2 className="text-3xl font-bold tracking-tight mt-1">{totalGames.count}</h2>
                            </div>
                        </CardBody>
                        <CardFooter className="px-6 py-3 border-t border-default-200/50">
                            <Link href="/dashboard/games" className="text-primary-500 text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
                                View details <ChevronRight className="w-4 h-4" />
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Total Earnings */}
                    <Card className="bg-content1/40 backdrop-blur-md border border-default-200/50 hover:-translate-y-1 transition-transform duration-300 shadow-sm">
                        <CardBody className="p-6 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="p-3 rounded-2xl bg-success-500/10 text-success-500">
                                    <CircleDollarSign className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-default-500 font-medium text-sm">Total Revenue</p>
                                <h2 className="text-3xl font-bold tracking-tight mt-1">${Number(totalEarnigs.sum).toLocaleString()}</h2>
                            </div>
                        </CardBody>
                        <CardFooter className="px-6 py-3 border-t border-default-200/50">
                            <Link href="/dashboard/orders" className="text-success-500 text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity">
                                View details <ChevronRight className="w-4 h-4" />
                            </Link>
                        </CardFooter>
                    </Card>
              
                </ul>

                {/* Main Content Area: Chart */}
                <div className="col-span-3 xl:col-span-3 mt-4">
                    <Card className="bg-content1/30 backdrop-blur-md border border-default-200/50 w-full shadow-md">
                        <CardHeader className="px-8 pt-8">
                            <h3 className="text-xl font-bold">Sales Overview</h3>
                        </CardHeader>
                        <CardBody className="px-4 pb-8 w-full">
                            <SalesChart data={sales} />
                        </CardBody>
                    </Card>
                </div>

                {/* Sidebar: Top Sell Games */}
                <div className="col-span-3 xl:col-span-1 row-start-1 row-end-3 flex flex-col gap-4 mt-6 xl:mt-0">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-lg font-bold tracking-tight">Top Sellers</h3>
                        <Chip size="sm" variant="flat" color="primary">All Time</Chip>
                    </div>
                    
                    <div className="flex flex-col gap-4 h-[calc(100vh-200px)] xl:h-auto overflow-y-auto pr-2 scrollbar-hide pb-20">
                        {mostSellGames.map((game, index) => (
                            <Card 
                                key={game.id} 
                                className="w-full bg-content1/40 backdrop-blur-md border border-default-200/40 hover:bg-content2/60 transition-colors shadow-sm group"
                                isPressable
                            >
                                <CardBody className="p-3 flex flex-row items-center gap-4">
                                    <div className="relative shrink-0">
                                        <Image 
                                            alt={game.title}
                                            className="object-cover rounded-xl w-[80px] h-[80px] shadow-sm group-hover:scale-105 transition-transform" 
                                            src={game.img_url}
                                        />
                                        <div className="absolute -top-2 -left-2 z-10 bg-background/80 backdrop-blur-md border border-default-200 w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold shadow-sm">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-1 gap-1">
                                        <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
                                            {game.title}
                                        </h4>
                                        <p className="text-xs text-default-400 font-medium mt-1">
                                            {game.count} units sold
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}