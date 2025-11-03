import MainGamesAdmin from "./(components)/mainGamesAdmin"

export  default async function pageGame(){
    const gamesResponse=await fetch("/api/games?quantity=all")
    const data= await gamesResponse.json()
    return <>
        <MainGamesAdmin games={data}></MainGamesAdmin>
    </>
}