"use client"
import { Games, sreenshoots, tags } from "@/types/database";
import { ProductCart } from "@/UI/Components/Card";

import { CarouselGameDetail } from "./Carroulsel";
import { Card, CardBody, Chip, Button,Image } from "@heroui/react";
export default function MainContent({game,tags,screenshoots}:{game:Games,tags:tags[],screenshoots:sreenshoots[]}){
    
    return <>
        <section className="m-0 p-0 w-full">
            <Card className=" m-0 p-0 " style={{backgroundImage:`url(${game.img_url})`,backgroundSize:'cover',backgroundPosition:'center',}}>
                <CardBody  className="w-1/3 p-0 bg-black/60 ">
                        <span className="min-h-[910] p-16 h-full flex flex-col  justify-center gap-5">
                            <section className="gap-5 flex flex-col">
                          <h2 className="text-5xl text-gray-50 font-bold uppercase">{game.title}</h2>

                            </section>
                  
                        <h2 className="text-gray-50  font-bold leading-6">
                        {game.description}

                        </h2>
                                 <span className="mt-4 flex flex-wrap gap-2 uppercase ">
                            {tags.map(tag=>(
                            <Chip variant="bordered" color="warning"  size="sm" radius="none"  key={tag.tag_id}>{tag.tag_name}</Chip>
                        ))} </span>
                        <Button className="w-1/2  text-center" color="primary" variant="shadow">Buy now</Button>

                    </span>
                  


                </CardBody>
            
            </Card>
               <div className="m-4 grid grid-cols-2 grid-rows-[700px] place-items-center" >
                         <CarouselGameDetail images={screenshoots}></CarouselGameDetail>    
                         <span className="flex flex-row flex-wrap justify-center  items-center p-2 gap-5 ">
                            {screenshoots.map(screenshot=>(
                                <Card key={screenshot.id} className="w-1/3   flex ">
                                    <CardBody className="">
                                        <Image  src={screenshot.screenshot_url}></Image>
                                    </CardBody>
                                </Card>
                            ))}
                         </span>
                       
                     
                    </div>
                        <span className="flex p-5 bg-black gap-5 justify-baseline">
                <ProductCart game={game}></ProductCart>
                <ProductCart game={game}></ProductCart>

                <ProductCart game={game}></ProductCart>

            </span>
          
               
        </section>
    </>

}