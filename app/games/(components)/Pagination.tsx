import { Games } from "@/types/database";
import { Button } from "@heroui/react";
import { SetStateAction } from "react";

export function Pagination({listGames,previousPage,nextPage,index,setPage}:{listGames:Games[],previousPage:()=>void,nextPage:()=>void,index:number,setPage:(number:number)=>void}){
    const quantity=[]
    for (let index = 0; index <= listGames.length/9; index++) {
        quantity.push(index)
        
    }
    return <>
               <Button variant="ghost" isDisabled={index==0} onPress={previousPage} className="mr-1"  color="primary" isIconOnly>{'<'}</Button>

            {
                quantity.map((number:number)=>(
               <Button onPress={()=>{
                setPage(number)
               }} className={`mr-1 ${index==number?'border-2':''}` }  key={number} color="primary" isIconOnly>{number}</Button>

                ))
                
            }
               <Button variant="ghost"  isDisabled={index>=Math.floor(listGames.length/9)} onPress={nextPage} className="mr-1"  color="primary" isIconOnly>{'>'}</Button>

        </>
}