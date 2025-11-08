import MainGamesAdmin from "./(components)/mainGamesAdmin"

export  default async function pageGame(){
    const gamesResponse=await fetch(`${process.env.NEXT_LOCAL_URL}/api/games?quantity=all`)
    const data= await gamesResponse.json()
    return <>
        <MainGamesAdmin games={data}></MainGamesAdmin>
    </>
}