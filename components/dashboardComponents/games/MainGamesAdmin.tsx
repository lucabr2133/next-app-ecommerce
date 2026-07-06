"use client"
import { Games } from "@/types/database";
import { ProductCart } from "@/components/globalComponents/Card";
import { addToast, Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, Pagination, Spinner, useDisclosure, Divider } from "@heroui/react";
import { Plus, Gamepad2 } from "lucide-react";
import { useMemo, useState } from "react";

export default function MainGamesAdmin({games}:{games:Games[]}){
    const [gamesState, setGames] = useState<Games[]>(games)
    const itemsPage = 9
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setloading] = useState(false)
    const pages = Math.ceil(gamesState.length/itemsPage)
    
    const gamesPage = useMemo(() => {
        const gamesCut = gamesState.slice((currentPage-1)*9, 9*currentPage)
        return gamesCut
    }, [currentPage, gamesState])
    
    const {isOpen, onOpenChange, onOpen} = useDisclosure()
    const values = games.length > 0 
      ? Object.keys(games[0]).filter(key => !['id', 'created_at', 'img_url', 'trailer_url'].includes(key))
      : [];
    const [errors, setErrors] = useState({})
    
    async function onHandleCreateGame(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const formdata = new FormData(e.currentTarget)
        const res = await fetch(`/api/games`, {
            method: 'POST',
            body: formdata,
        })
        const data = await res.json()

        if(!data?.success){
            setErrors(data?.errors?.fieldErrors || {})
        }
        if(data?.game){
            setGames([...gamesState, data?.game])
            addToast({
                title: 'Game created succesfully',
                variant: 'flat',
                color: 'success'
            })
        } else {
            addToast({
                title: 'Fail to create a game',
                variant: 'flat',
                color: 'danger'
            })
        }
    }
  
    return (
        <main className="min-h-screen p-4 md:p-10 w-full flex flex-col gap-8 bg-background relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <header className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <Gamepad2 className="text-primary w-6 h-6" />
                        </div>
                        <h2 className="font-bold text-3xl tracking-tight">Games Management</h2>
                    </div>
                    <Button 
                        onPress={onOpen} 
                        startContent={<Plus className="w-4 h-4" />} 
                        color="primary" 
                        variant="shadow"
                        className="font-medium"
                    >
                        Add Game
                    </Button>
                </div>
                <p className="text-default-500 text-sm pl-12">Manage your game catalog and inventory</p>
                <Divider className="my-4 opacity-50" />
            </header>

            <Modal 
                isOpen={isOpen} 
                onOpenChange={onOpenChange} 
                backdrop="blur" 
                classNames={{
                    base: "bg-content1/70 backdrop-blur-md border border-default-200/50",
                    header: "border-b border-default-200/50",
                    footer: "border-t border-default-200/50"
                }}
            >
                <ModalContent className="sm:max-w-[600px]">
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <h3 className="font-bold text-xl">Add a new game</h3>
                                <p className="text-sm font-normal text-default-500">Fill in the details below to add a game to the catalog.</p>
                            </ModalHeader>
                            <ModalBody className="py-6">
                                <Form validationErrors={errors} className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onHandleCreateGame}>
                                    {values.map(value => (
                                        <Input 
                                            key={value} 
                                            type={value == 'release_at' || value == 'updated_at' ? 'date' : 'text'} 
                                            placeholder={`Enter ${value == 'company_id' ? "company name" : value.replace('_', ' ')}`} 
                                            isRequired 
                                            label={value == 'company_id' ? "Company Name" : value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')} 
                                            name={value == 'company_id' ? "company_name" : value}
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: "bg-default-100/50 group-data-[focus=true]:bg-default-100"
                                            }}
                                        />
                                    ))}
                                    <div className="col-span-1 md:col-span-2 mt-2">
                                        <label className="text-sm font-medium text-default-700 mb-2 block">Cover Image</label>
                                        <Input 
                                            type="file" 
                                            name="file"
                                            variant="bordered"
                                            classNames={{
                                                inputWrapper: "bg-default-100/50 group-data-[focus=true]:bg-default-100"
                                            }}
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-4">
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" color="primary" variant="shadow">
                                            Create Game
                                        </Button>
                                    </div>
                                </Form>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center py-20">
                        <Spinner size="lg" color="primary" />
                    </div>
                ) : gamesPage.map(game => (
                    <ProductCart key={game.id} setGames={setGames} game={game} />
                ))}
            </div>
            
            {pages > 1 && (
                <div className="flex justify-center w-full mt-8">
                    <Pagination 
                        loop 
                        page={currentPage} 
                        onChange={setCurrentPage} 
                        showControls 
                        total={pages} 
                        color="primary"
                        variant="flat"
                    />
                </div>
            )}
        </main>
    );
}