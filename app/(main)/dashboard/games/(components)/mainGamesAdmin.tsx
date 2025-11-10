"use client"
import { Games } from "@/types/database";
import { ProductCart } from "@/UI/Components/Card";
import { addToast, Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, Pagination, Spinner, useDisclosure } from "@heroui/react";
import { CrossIcon } from "lucide-react";
import { useMemo, useState } from "react";

export default function MainGamesAdmin({games}:{games:Games[]}){
    const [gamesState,setGames]=useState<Games[]>(games)
    const itemsPage=9
    const [currentPage,setCurrentPage]=useState(1)
    const [loading,setloading]=useState(false)
    const pages=Math.ceil(gamesState.length/itemsPage)
      const gamesPage=useMemo(()=>{

        const gamesCut= gamesState.slice((currentPage-1)*9,9*currentPage)
        return gamesCut

    },[currentPage,gamesState])
    const {isOpen,onOpenChange,onOpen}=useDisclosure()
  const values = games.length > 0 
  ? Object.keys(games[0]).filter(key => !['id', 'created_at', 'img_url', 'trailer_url'].includes(key))
  : [];
    const [errors,setErrors]=useState({})
    async function onHandleCreateGame(e:React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        const formdata=new FormData(e.currentTarget)
       const res= await fetch(`/api/games`,{
            method:'POST',
            body:formdata,
         
            
        })
                  const data=await res.json()

           if(!data?.success){
            console.log(data?.errors?.fieldErrors);
            
            setErrors(data?.errors?.fieldErrors)
        }
           if(data?.game){

                  setGames([...gamesState,data?.game])
                    
     
            addToast({
                title:'Game created succesfully',
                variant:'flat',
                color:'success'

            })
          
        }else{
            addToast({
                title:'Fail to create a game',
                variant:'flat',
                color:'danger'
            })
        }
  
      

    }
  
    return <main className="min-h-screen w-full p-12 flex flex-col items-center">
        <Modal isOpen={isOpen} onOpenChange={(onOpenChange)} >
            <ModalContent className="min-w-1/3">
            {onClose=>(
                <>
           <ModalHeader>
                Add a game
            </ModalHeader>
            <ModalBody>
                 <Form validationErrors={errors}   className="grid grid-cols-2 gap-5" onSubmit={onHandleCreateGame}>
                    {values.map(value=>(
                        <Input key={value} type={value=='release_at' ||value=='updated_at'?'date':'text'} placeholder={`${value=='company_id'?"company name":value}: `} isRequired label={`Enter  ${value=='company_id'?"company name":value}:`} name={value=='company_id'?"company_name":value} ></Input>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading?<Spinner>loading</Spinner>: gamesPage.map(game=>(
                <ProductCart key={game.id} setGames={setGames} game={game}></ProductCart>
            ))}
           
        </div>
        <Pagination loop page={currentPage} onChange={setCurrentPage} showControls total={pages}></Pagination>

    </main>
}