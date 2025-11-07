"use client"

import { Games, Genres } from "@/types/database";
import { Button, Link } from "@heroui/react";
import { ProductCart } from "./Card";
import { Carousel } from "./Carrousel";
import { CarouselCard } from "./CarrouselCard";
import { useMemo } from "react";

export function MainHome({data,dataGenres,data30Games}:{data:Games[],dataGenres:Genres[],data30Games:Games[]}){
        const  featuredGamesResponse=useMemo(()=>{
        return data30Games.slice(0,6)
    },[data30Games])
    return  <main className=" grid grid-rows-[800px_1fr_1fr] grid-cols-[1fr_1fr_1fr_350px] gap-2 ">
   
               <Carousel games={featuredGamesResponse} ></Carousel>
                
                 
        <section   className=" col-start-1 col-end-5   flex gap-5 flex-col">
            <div className="bg-black rounded-2xl p-5">
                 <span className="flex justify-between">
             <h2 className="text-3xl uppercase font-extrabold "> New Games</h2>
                </span>
            <span  className="  p-5 gap-10  flex ">
               <CarouselCard games={data} ></CarouselCard>
                     
                  

            </span>
            </div>
           
              <div className="bg-black rounded-2xl p-5">
                 <span className="flex justify-between">

                    <h2 className="text-3xl uppercase font-extrabold ">Discounts</h2>
                </span>
                <span  className=" b flex p-5 gap-10 w-full">
                               <CarouselCard games={data} ></CarouselCard>

                 
                

                </span>
            </div>
          
        </section>
        

        <footer className="bg-black rounded-2xl col-start-1 col-end-6 text-center  flex items-center flex-col  ">
         <div className="bg-black rounded-2xl col-start-4 col-end-5 text-center w-full h-full ">
            <p  >Categories </p>
            <div className="grid w-full gap-10 grid-cols-4   p-3 h-full  ">
                {dataGenres.map(genres=>(
                      <Link
            href="/games"
            className="flex justify-center items-center w-full h-full text-2xl font-bold text-amber-400 hover:text-amber-300 transition-all border-1 rounded-3xl"
          >
            {genres.name}
          </Link>
                ))}
            </div>
        </div>
              
        </footer>

    

        </main>
    
}