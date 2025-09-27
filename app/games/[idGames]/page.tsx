import { Games } from "@/types/database"
import MainContent from "../(components)/MainContent"


export default async  function Page({ params }: { params: Promise<{ idGames: string }> }) {
    const {idGames}= await params
    
    const game= await fetch(`http://localhost:3000/api/games/${idGames}`)
    const data:Games[]=await game.json()
    const gameData=data[0]
return <>
    <main className=" px-32 bg-black " style={{backgroundImage:`url(${gameData.img_url})`,backgroundSize:'100% 100%'}} >
      <MainContent game={gameData}>

      </MainContent>
    </main>
  </>
}