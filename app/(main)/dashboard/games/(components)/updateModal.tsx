"use client"
import { Games } from "@/types/database";
import { addToast, Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { SetStateAction, useState } from "react";
import { keyof } from "zod";

export function UpdateModal({game,onOpenChange,isOpen,setGames}:{game:Games,onOpenChange:()=>void,isOpen:boolean,setGames:React.Dispatch<SetStateAction<Games[]>>|null}){
    const gameKeys=Object.keys(game).filter(key=>key!='id'&& key!='trailer_url'&&key!='img_url' &&key!='created_at' && key!='release_at' && key!='company_id') as (keyof Games)[]
    const [errors,setErrors]=useState({})
    
    const  onHandleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        const formData= new FormData(e.currentTarget)
        
       const res= await fetch(`/api/games/${game.id}`,{
            method:'PATCH',
          
            body:formData
        })
        const data= await res.json()
        
        if(!data?.success){
            setErrors(data?.errors)
        }
        if( data?.game && setGames!=null){
            setGames((prev)=>{
                return prev.map((game)=>{
                    if(game.id==data.game.id){
                       return game={
                            ...data.game,
                        }
                    }
                    return game
                })
            })
            addToast({
                title:'Update game succesfully',
                color:'success',
                variant:'flat'
            })
        }
        if(data?.error){
             addToast({
                title:'Fail to updated the game',
                color:'danger',
                variant:'flat'
            })
        }
        
    }
    return <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
        <ModalContent className="min-w-1/3">
            {(onclose)=>(
                <>
                <ModalHeader>Update Game</ModalHeader>
                <ModalBody>
                    <Form validationErrors={errors} className="grid grid-cols-2 gap-5" onSubmit={onHandleSubmit}>
                        {gameKeys.map((gameField)=>(
                        <Input type={gameField==='updated_at'?'Date':'text'} required defaultValue={String(game[gameField])} placeholder={gameField} label={`write the ${gameField} field`}name={gameField}></Input>

                        ))}
                        <Input type="file" label="Img file" name="file"></Input>
                        <Button type="submit" color="warning" variant="flat">Update</Button>
                    </Form>
                </ModalBody>
                </>
            
            )}
        </ModalContent>
    </Modal>
}