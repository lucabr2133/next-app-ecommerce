import { Games, Genres } from "@/types/database";
import { ProductCart } from "@/UI/Components/Card";
import { Carousel } from "@/UI/Components/Carrousel";
import { LoadGames } from "./services/loadData";
import { CarouselCard } from "@/UI/Components/CarrouselCard";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Link } from "@heroui/react";
import { MainHome } from "@/UI/Components/Main";
import { useContext } from "react";
import { CartContext } from "./contex/contex";export default async function page(){
    // const games = await fetch('https://api.rawg.io/api/games?key=53c5fa302d924b35b320957cc61a057a&metacritic=80,100&page_size=3000',{
    //     headers: {
	// 	'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com'
	// }
    // })
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