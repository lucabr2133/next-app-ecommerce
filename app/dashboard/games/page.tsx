import MainGamesAdmin from "./(components)/mainGamesAdmin"

export  default async function pageGame(){
    const gamesResponse=await fetch('http://localhost:3000/api/games?quantity=all')
    const data= await gamesResponse.json()
    return <>
        <MainGamesAdmin games={data}></MainGamesAdmin>
    </>
}