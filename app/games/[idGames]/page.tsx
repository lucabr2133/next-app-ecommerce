import { gameDetailResponse } from "@/types/database"
import MainContent from "../(components)/MainContent"


export default async  function Page({ params }: { params: Promise<{ idGames: string }> }) {
    const {idGames}= await params
    
    const game= await fetch(`http://localhost:3000/api/games/${idGames}`)
    
    const data:gameDetailResponse=await game.json()

    const gameData=data.game[0]
    const tags= data.tags
    const screenshoots=data.screenshots
return <>
    <main className="p-0 m-0  bg-black " >
      <MainContent screenshoots={screenshoots} tags={tags} game={gameData}>
      
      </MainContent>
    </main>
  </>
}