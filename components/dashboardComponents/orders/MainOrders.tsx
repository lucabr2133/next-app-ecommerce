"use client"
import { Table, TableBody, TableColumn, TableCell, TableHeader, TableRow, Divider, Card, CardBody, Button, Chip, Modal, ModalContent, ModalBody, useDisclosure, ModalHeader, Image, ModalFooter, Spinner } from "@heroui/react";
import { PackageSearch, Eye, Calendar, User, CheckCircle2 } from "lucide-react";
import postgres from "postgres";
import { Suspense, useCallback, useState } from "react";

export function MainOrders({orders}:{orders:postgres.Row[]}){
    const {isOpen, onOpen, onOpenChange} = useDisclosure()
    const [currentOrder, setCurrentOrder] = useState<postgres.Row|null>(null)
    const [currentGames, setCurrentGames] = useState<postgres.Row[]|null>(null)
    const [isLoadingDetails, setIsLoadingDetails] = useState(false)
    
    const renderCell = useCallback((order:postgres.Row, columkey:string)=>{
        const cell = order[columkey]
        switch (columkey){
            case 'id':
                return <span className="font-mono text-xs">{cell}</span>
            case 'user_id':
                return <span className="text-sm">{cell}</span>
            case 'status':
                return (
                    <Chip size="sm" variant="flat" color={cell === 'paid' ? 'success' : 'warning'} className="capitalize">
                        {cell}
                    </Chip>
                )
            case 'created_at':
                return <span className="text-sm text-default-500">{new Date(cell).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</span>
            case 'username':
                return <span className="font-medium text-sm">{cell}</span>
            case 'action':
                return (
                    <div className="flex gap-4 w-full">
                        <Button 
                            size="sm" 
                            color="primary" 
                            variant="flat" 
                            startContent={<Eye className="w-4 h-4" />}
                            onPress={async()=>{
                                setCurrentOrder(order)
                                setCurrentGames(null)
                                setIsLoadingDetails(true)
                                onOpen()
                                const gamesOrder = await fetch(`/api/checkout/success?orderId=${order?.id}`, {
                                    credentials: 'include'
                                })
                                const dataGames = await gamesOrder.json()
                                
                                if(dataGames?.error){
                                    setCurrentGames([])
                                } else {
                                    setCurrentGames(dataGames)
                                }
                                setIsLoadingDetails(false)
                            }}
                        >
                            View Details
                        </Button>
                    </div>
                )
        }
    }, [orders, onOpen])
    
    const keys = orders.length > 0 ? Object.keys(orders[0]) : [];
    if (!keys.includes('action')) {
        keys.push('action');
    }

    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Spinner size="lg" color="primary" /></div>}>
        <main className="min-h-screen p-4 md:p-10 w-full flex flex-col gap-8 bg-background relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-warning/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            
            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-warning/10 rounded-xl">
                        <PackageSearch className="text-warning-500 w-6 h-6" />
                    </div>
                    <h2 className="font-bold text-3xl tracking-tight">Orders Management</h2>
                </div>
                <p className="text-default-500 text-sm pl-12">Review and manage customer purchases</p>
                <Divider className="my-4 opacity-50" />
            </header>

            <div className="w-full bg-content1/40 backdrop-blur-md rounded-2xl shadow-sm border border-default-200/50">
                <Table
                    aria-label="Orders Table"
                    className="w-full"
                    isStriped={false}
                    removeWrapper
                    classNames={{
                        th: "bg-default-100/50 text-default-500 text-xs font-bold uppercase tracking-wider",
                        td: "py-4 border-b border-default-100 last:border-b-0"
                    }}
                >
                    <TableHeader>
                        {keys.map((key) => (
                            <TableColumn key={key}>
                                {key.replace('_', ' ')}
                            </TableColumn>
                        ))}
                    </TableHeader>

                    <TableBody emptyContent={"No orders found"} items={orders}>
                        {(item) => (
                            <TableRow key={item.id} className="hover:bg-default-50/50 transition-colors">
                                {(columnKey) => (
                                    <TableCell>
                                        {renderCell(item, String(columnKey))}
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Modal 
                onOpenChange={onOpenChange} 
                isOpen={isOpen} 
                onClose={()=>{
                    setCurrentOrder(null)
                    setCurrentGames(null)
                }}
                backdrop="blur"
                scrollBehavior="inside"
                classNames={{
                    base: "bg-content1/80 backdrop-blur-md border border-default-200/50",
                    header: "border-b border-default-200/50 bg-default-50/30",
                    footer: "border-t border-default-200/50 bg-default-50/30"
                }}
            >
                <ModalContent className="sm:max-w-[700px]">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 p-6">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-xl">Order Receipt</h3>
                                    <Chip size="sm" variant="flat" color={currentOrder?.status === 'paid' ? 'success' : 'warning'} className="capitalize ml-2">
                                        {currentOrder?.status}
                                    </Chip>
                                </div>
                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-default-500">
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-mono text-xs p-1 bg-default-100 rounded-md">ID: {currentOrder?.id}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>{currentOrder?.created_at ? new Date(currentOrder.created_at).toLocaleString() : ''}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <User className="w-4 h-4" />
                                        <span>{currentOrder?.username}</span>
                                    </div>
                                </div>
                            </ModalHeader>
                    
                            <ModalBody className="p-6">
                                <h4 className="font-semibold text-sm uppercase tracking-wider text-default-500 mb-2">Purchased Items</h4>
                                {isLoadingDetails ? (
                                    <div className="flex justify-center py-10"><Spinner color="primary" /></div>
                                ) : currentGames?.length === 0 ? (
                                    <p className="text-default-500 text-center py-4">No items found for this order.</p>
                                ) : (
                                    <div className="flex flex-col gap-3">
                                        {currentGames?.map(game => (
                                            <Card key={game.id} className="bg-default-50/50 shadow-none border border-default-200/40">
                                                <CardBody className="p-3 flex flex-row gap-4 items-center">
                                                    <Image 
                                                        alt={game.title}
                                                        className="object-cover w-20 h-20 rounded-lg shadow-sm" 
                                                        src={game.img_url}
                                                    />
                                                    <div className="flex flex-col flex-1 justify-between h-full py-1">
                                                        <div className="flex justify-between items-start w-full">
                                                            <h2 className="font-bold text-md leading-tight">{game.title}</h2>
                                                            <span className="font-bold text-md">${game.price}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between mt-auto pt-2 border-t border-default-200/30">
                                                            <span className="text-xs font-medium text-default-500">Activation Key:</span>
                                                            <Chip size="sm" color="success" variant="flat" startContent={<CheckCircle2 className="w-3 h-3 ml-1" />}> 
                                                                <span className="font-mono">{game.code_key}</span>
                                                            </Chip>
                                                        </div>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </ModalBody>
                            
                            <ModalFooter className="p-6 flex justify-between items-center bg-default-50/50">
                                <span className="text-default-500 text-sm">Payment processed</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium uppercase tracking-wider text-default-500">Total</span>
                                    <span className="text-2xl font-bold">
                                        ${currentGames?.reduce((prev, current) => prev + parseFloat(current.price), 0).toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </main>
      </Suspense>
    );
}
