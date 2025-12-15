import MainGamesAdmin from "@/components/dashboardComponents/games/MainGamesAdmin"

export  default async function pageGame(){
    const url=process.env.NEXT_PUBLIC_API_URL

    const gamesResponse=await fetch(`${url}/api/games?quantity=all`)
    
    const data= await gamesResponse.json()
    return <>
        <MainGamesAdmin games={data}></MainGamesAdmin>
    </>
}