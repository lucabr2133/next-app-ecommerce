"use client"
import { Games } from "@/types/database";
import { Button, Form, Input, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { useState } from "react";

export function UpdateModal({game,onOpenChange,isOpen}:{game:Games,onOpenChange:()=>void,isOpen:boolean}){
    const gameKeys=Object.keys(game).filter(key=>key!='id'&& key!='trailer_url'&&key!='img_url' &&key!='created_at' && key!='release_at' && key!='company_id')
    const [errors,setErrors]=useState({})
    
    const  onHandleSubmit=async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        
        const formData= new FormData(e.currentTarget)
        
       const res= await fetch(`http://localhost:3000/api/games/${game.id}`,{
            method:'PATCH',
          
            body:formData
        })
        const data= await res.json()
        if(!data.success){
            setErrors(errors)
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
                        <Input required defaultValue={game[gameField]} placeholder={gameField} label={`write the ${gameField} field`}name={gameField}></Input>

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