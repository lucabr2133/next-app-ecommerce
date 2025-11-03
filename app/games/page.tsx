import { Games, Genres } from "@/types/database"

import { MainGames } from "./(components)/MainGames";
import { notFound } from "next/navigation";

export default async  function gamesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }){
    
    const response=await fetch(`${process.env.NEXT_LOCAL_URL}/api/games?quantity=all&genre=${searchParams.genre}&search=${searchParams.search}`)
    const data:Games[]=await response.json()
       const ResponseGeneres= await fetch(`${process.env.NEXT_LOCAL_URL}/api/genres`)
   const genres:Genres[]= await ResponseGeneres.json()
   if(data.length==0){
     return <>
     <div className="m-auto text-center h-[900px] w-[900px] flex place-items-center">
      NO GAME FOUND !!
      Try again

     </div>
     </>
   }
    return <MainGames genres={genres} data={data}></MainGames>
    
}