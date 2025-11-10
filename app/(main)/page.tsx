import { Games, Genres } from "@/types/database";
import { MainHome } from "@/UI/Components/Main";
import { useMemo } from "react";
export default async function page(){
    const url=process.env.NEXT_PUBLIC_API_URL
    const newGames= await fetch(`${url}/api/games?quantity=10`)
    const GamesResponse= await fetch(`${url}/api/games?quantity=27`)

    const data:Games[]= await newGames.json()
    const data30Games:Games[]=await GamesResponse.json()

    const genres= await fetch(`${url}/api/genres`)
    const dataGenres:Genres[]= await genres.json()
    return <>
       
       <MainHome dataGenres={dataGenres} data={data} data30Games={data30Games} >

       </MainHome>
    </>
}