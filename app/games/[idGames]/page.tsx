import { gameDetailResponse } from "@/types/database"
import MainContent from "../(components)/MainContent"


export default async  function Page({ params }: { params: Promise<{ idGames: string }> }) {
    const {idGames}= await params
    
    const game= await fetch(`http://localhost:3000/api/games/${idGames}`)
    
    const data:gameDetailResponse=await game.json()
    console.log(data);

    const gameData=data.game[0]
    const tags= data.tags
    const screenshoots=data.screenshots
return <>
    <main className=" px-32 bg-black " style={{backgroundImage:`url(${gameData.img_url})`,backgroundSize:'100% 100%'}} >
      <MainContent screenshoots={screenshoots} tags={tags} game={gameData}>

      </MainContent>
    </main>
  </>
}