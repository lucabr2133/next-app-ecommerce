import { Games, sreenshoots, tags } from "@/types/database";
import { ProductCart } from "@/UI/Components/Card";
import { Button } from "@heroui/button";
import { Card,CardBody,CardFooter,CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";
import {Chip} from "@heroui/chip";
import { Carousel } from "@/UI/Components/Carrousel";
import { CarouselGameDetail } from "./Carroulsel";
export default function MainContent({game,tags,screenshoots}:{game:Games,tags:tags[],screenshoots:sreenshoots[]}){
    
    return <>
        <section className="">
            <Card radius="none" className="m-0 border-none" >
                <CardBody   className="grid grid-cols-2 gap-10 " >
                    <div className="" >
                         <CarouselGameDetail images={screenshoots}></CarouselGameDetail>
                        <span className="mt-4 flex flex-wrap gap-2">
                      {tags.map(tag=>(
                            <Chip variant="bordered" color="warning" size="sm" radius="sm"  key={tag.tag_id}>{tag.tag_name}</Chip>
                        ))} 
                        </span>
                     
                    </div>
                        
                        <Card>
                            <CardHeader className="flex justify-center text-4xl font-bold  text-white/60 uppercase ">{game.title}</CardHeader>
                            <CardBody className="px-32">
                                {game.description}
                            </CardBody>
                            <CardFooter className="px-32 flex  flex-col">
                                <Card className="bg-default-100 rounded-2xl w-full " radius="none">
                                <CardHeader className=" h-7 text-3xl pt-10 font-bold  text-white/60 uppercase  ">
                                    {`Buy ${game.title}`}
                                </CardHeader>
                                    <CardBody className="w-full h-1/2 flex flex-row justify-end gap-5" >
                                        <Button variant="shadow" color="primary"  className="" size="sm">Add to cart</Button>
                                        <Button variant="shadow" color="primary"  className="" size="sm">Buy now!!</Button>


                                    </CardBody>

                                </Card>

                            </CardFooter>
                        </Card>

              
                </CardBody>
                <CardFooter className="flex flex-col items-start">
 <span className="flex p-5  gap-5 justify-baseline flex-col px-10">
                <h2 className="font-bold text-tiny text-white/60 uppercase ">About the game</h2>
                <ul className="list-disc px-10    ">
                   <li>a</li>
                   <li>a</li>
                   <li>a</li>
                   <li>a</li>
                   <li>a</li>

                </ul>
            </span>
                <h2 className="font-bold text-tiny text-white/60 uppercase  px-10">Simillar games</h2>

            <span className="flex p-5 bg-black gap-5 justify-baseline">
                <ProductCart game={game}></ProductCart>
                <ProductCart game={game}></ProductCart>

                <ProductCart game={game}></ProductCart>

            </span>

                </CardFooter>
            </Card>
               
        </section>
    </>

}