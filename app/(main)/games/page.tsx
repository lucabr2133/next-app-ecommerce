import { Games, Genres } from "@/types/database"

import { MainGames } from "./(components)/MainGames";
import { notFound } from "next/navigation";

export default async  function gamesPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }){
    const url=process.env.NEXT_PUBLIC_API_URL
    const {genre,search}=await searchParams
    const response=await fetch(`${url}/api/games?quantity=all&genre=${genre}&search=${search}`)
    const data:Games[]=await response.json()
       const ResponseGeneres= await fetch(`${url}/api/genres`)
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