import { Games, Genres } from "@/types/database";
import { MainHome } from "@/UI/Components/Main";
export default async function page(){
  
    const newGames= await fetch('http://localhost:3000/api/games?quantity=10')
    const GamesResponse= await fetch('http://localhost:3000/api/games?quantity=27')

    const data:Games[]= await newGames.json()
    const data30Games:Games[]=await GamesResponse.json()
    
    const genres= await fetch('http://localhost:3000/api/genres')
    const dataGenres:Genres[]= await genres.json()
    return <>
       
       <MainHome dataGenres={dataGenres} data={data} data30Games={data30Games} >

       </MainHome>
    </>
}