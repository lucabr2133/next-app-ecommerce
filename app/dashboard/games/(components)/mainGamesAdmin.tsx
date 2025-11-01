"use client"
import { Games } from "@/types/database";
import { ProductCart } from "@/UI/Components/Card";
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, Pagination, useDisclosure } from "@heroui/react";
import { CrossIcon } from "lucide-react";
import { useMemo, useState } from "react";

export default function MainGamesAdmin({games}:{games:Games[]}){
    const itemsPage=9
    const [currentPage,setCurrentPage]=useState(1)
    const pages=Math.ceil(games.length/itemsPage)
      const gamesPage=useMemo(()=>{
        return games.slice((currentPage-1)*9,9*currentPage)
    },[currentPage])
    const {isOpen,onOpenChange,onOpen}=useDisclosure()
    const values=Object.keys((games[0])).filter((key)=>key!= 'id' && key!='created_at' &&key!='img_url' && key!='trailer_url')
    const [errors,setErrors]=useState({})
    async function onHandleCreateGame(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const formdata=new FormData(e.currentTarget)
       const res= await fetch('http://localhost:3000/api/games',{
            method:'POST',
            body:formdata
        })
        const data=await res.json()

        if(!data?.success){
            console.log(data.errors.fieldErrors);
            
            setErrors(data.errors.fieldErrors)
        }

    }
  
    return <main className="min-h-screen w-full p-12 flex flex-col items-center">
        <Modal isOpen={isOpen} onOpenChange={(onOpenChange)} >
            <ModalContent className="min-w-1/3">
            {onclose=>(
                <>
           <ModalHeader>
                Add a game
            </ModalHeader>
            <ModalBody>
                 <Form validationErrors={errors}   className="grid grid-cols-2 gap-5" onSubmit={onHandleCreateGame}>
                    {values.map(value=>(
                        <Input  type={value=='release_at' ||value=='updated_at'?'date':'text'} placeholder={`${value=='company_id'?"company name":value}: `} isRequired label={`Enter  ${value=='company_id'?"company name":value}:`} name={value=='company_id'?"company_name":value} ></Input>
                    ))}
                    <Input type="file" className="col-start-1 col-end-3" name="file"></Input>
                    <Button type="submit" variant="flat" color="primary" >Create</Button>
                </Form>
            </ModalBody>
              
                </>     )}
            </ModalContent>
            


          
     
       
        </Modal>
        <div className="flex justify-between w-full">
        <h2 className="font-extrabold uppercase text-2xl">All games</h2>
            <Button onPress={onOpen} startContent={<CrossIcon></CrossIcon>} color="success" variant="flat">Add game</Button>
        </div>
        <div className="grid grid-cols-3 gap-5">
            {gamesPage.map(game=>(
                <ProductCart key={game.id} game={game}></ProductCart>
            ))}
        </div>
        <Pagination loop page={currentPage} onChange={setCurrentPage} showControls total={pages}></Pagination>

    </main>
}