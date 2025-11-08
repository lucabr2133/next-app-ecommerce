import { gameDetailResponse, Genres } from "@/types/database"
import MainContent from "../(components)/MainContent"
import { cookies, headers } from "next/headers";
import Error from "@/app/error";


export default async  function Page({ params }: { params: Promise<{ idGames: string }> }) {
    const {idGames}= await params
       const cookieStore =await cookies();
    const game= await fetch(`${process.env.NEXT_LOCAL_URL}/api/games/${idGames}`,{
        headers: { Cookie: cookieStore.toString() }, // 
    })
    if (!game.ok) {
    const err = await game.json();
    }
      
  
    const data:gameDetailResponse=await game.json() 
  
    
    const gameData=data.game[0]
    const tags= data.tags
    const screenshoots=data.screenshots
return <>
    <main className="p-0 m-0  bg-black " >
      <MainContent   screenshoots={screenshoots} tags={tags} game={gameData}>
      
      </MainContent>
    </main>
  </>
}