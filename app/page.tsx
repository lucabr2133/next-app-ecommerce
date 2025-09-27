import { Games, Genres } from "@/types/database";
import { ProductCart } from "@/UI/Components/Card";
import { Carousel } from "@/UI/Components/Carrousel";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default async function page(){
    // const games = await fetch('https://api.rawg.io/api/games?key=53c5fa302d924b35b320957cc61a057a&metacritic=80,100&page_size=3000',{
    //     headers: {
	// 	'x-rapidapi-host': 'rawg-video-games-database.p.rapidapi.com'
	// }
    // })
    const newGames= await fetch('http://localhost:3000/api/games?quantity=3')
    const GamesResponse= await fetch('http://localhost:3000/api/games?quantity=27')

    const data:Games[]= await newGames.json()
    const data30Games:Games[]=await GamesResponse.json()
    const genres= await fetch('http://localhost:3000/api/genres')
    const dataGenres:Genres[]= await genres.json()
    return <>
        <main className=" grid grid-rows-[800px_1fr_450px] grid-cols-[1fr_1fr_1fr_350px] gap-2 ">
               <Carousel games={data} ></Carousel>
                
                 
        <section   className=" col-start-1 col-end-4   flex gap-5 flex-col">
            <div className="bg-black rounded-2xl p-5">
                 <span className="flex justify-between">
             <h2> New Products</h2>
                <Link className="cursor-pointer">See more {'>'}</Link>
                </span>
            <span  className=" b flex p-5 gap-10 w-full">
               {data.map((game)=>(
                       <ProductCart game={game} key={game.id}>
                      
                       </ProductCart>
                   ))}

            </span>
            </div>
           
              <div className="bg-black rounded-2xl p-5">
                 <span className="flex justify-between">

                    <h2>Discounts</h2>
                        <Link className="cursor-pointer">See more {'>'}</Link>
                </span>
                <span  className=" b flex p-5 gap-10 w-full">
                   {data.map((game)=>(
                       <ProductCart game={game} key={game.id}>
                      
                       </ProductCart>
                   ))}
                 
                

                </span>
            </div>
          
        </section>
        <div className="bg-black rounded-2xl col-start-4 col-end-5 text-center  ">
            <p  >Categories </p>
            <div className="grid grid-cols-2  gap-5  p-3  ">
                {dataGenres.map(genres=>(
                    <div key={genres.id} className="">
                       <Button variant="light"  color="default" radius="sm" className="w-full text-[13px] border-1">{genres.name}</Button>

                    </div>
                ))}
            </div>
        </div>

        <footer className="bg-black rounded-2xl col-start-1 col-end-6 text-center text-5xl flex items-center flex-col  ">
            <p>More games</p>
                <div className="grid m-5 grid-cols-[1fr_1fr_1fr_1fr]  place-items-center gap-5">
  {data30Games.map((game)=>(
                    <ProductCart game={game} key={game.id}></ProductCart>
                ))}
                </div>
              
        </footer>

    

        </main>
    
    </>
}