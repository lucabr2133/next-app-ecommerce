"use client"

import { Games, Genres } from "@/types/database";
import { Button } from "@heroui/react";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@heroui/react";
import Link from "next/link";
import { ProductCart } from "./Card";
import { Carousel } from "./Carrousel";
import { CarouselCard } from "./CarrouselCard";

export function MainHome({data,dataGenres,data30Games}:{data:Games[],dataGenres:Genres[],data30Games:Games[]}){
    
    return  <main className=" grid grid-rows-[800px_1fr_450px] grid-cols-[1fr_1fr_1fr_350px] gap-2 ">
   
               <Carousel games={data} ></Carousel>
                
                 
        <section   className=" col-start-1 col-end-4   flex gap-5 flex-col">
            <div className="bg-black rounded-2xl p-5">
                 <span className="flex justify-between">
             <h2> New Games</h2>
                </span>
            <span  className="  p-5 gap-10  flex ">
               <CarouselCard games={data} ></CarouselCard>
                     
                  

            </span>
            </div>
           
              <div className="bg-black rounded-2xl p-5">
                 <span className="flex justify-between">

                    <h2>Discounts</h2>
                </span>
                <span  className=" b flex p-5 gap-10 w-full">
                               <CarouselCard games={data} ></CarouselCard>

                 
                

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

        <footer className="bg-black rounded-2xl col-start-1 col-end-6 text-center  flex items-center flex-col  ">
            <p>More games</p>
                <div className="grid m-5 grid-cols-[1fr_1fr_1fr_1fr]  place-items-center gap-5">
  {data30Games.map((game)=>(
                    <ProductCart game={game} key={game.id}></ProductCart>
                ))}
                </div>
              
        </footer>

    

        </main>
    
}