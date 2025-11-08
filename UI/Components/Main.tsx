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
    return  <main className=" grid grid-rows-[1f_1fr_1fr] grid-cols-[1fr_1fr_1fr_350px] gap-2 ">
   
               <Carousel games={featuredGamesResponse} ></Carousel>
                
                 
        <section   className=" col-start-1 col-end-5   grid gap-5 grid-rows-2">
            <div className="bg-black rounded-2xl md:p-5">
                 <span className="flex justify-between">
             <h2 className="text-3xl uppercase font-extrabold text-center w-full "> New Games</h2>
                </span>
            <span  className="  md:p-5 gap-10  flex ">
               <CarouselCard games={data} ></CarouselCard>
                     
                  

            </span>
            </div>
           
              <div className="bg-black rounded-2xl  md:p-5">
                 <span className="flex justify-between">

                    <h2 className="text-3xl uppercase font-extrabold w-full text-center ">Discounts</h2>
                </span>
                <span  className=" b flex md:p-5 gap-10 w-full">
                               <CarouselCard games={data} ></CarouselCard>

                 
                

                </span>
            </div>
          
        </section>
        

        <footer className="bg-black rounded-2xl col-start-1 col-end-6 text-center  flex items-center flex-col  ">
         <div className="bg-black rounded-2xl col-start-4 col-end-5 text-center w-full h-full ">
            <p  >Categories </p>
            <div className="  grid w-full gap-10 grid-cols-1  sm:grid-cols-2 md:grid-cols-3  p-3   ">
                {dataGenres.map(genres=>(
                      <Link key={genres.id}
            href="/games"
            className=" rounded-none flex justify-center items-center w-full h-[200]  text-2xl font-bold text-amber-400 hover:text-amber-300 transition-all border-1 "
          >
            {genres.name}
          </Link>
                ))}
            </div>
        </div>
              
        </footer>

    

        </main>
    
}