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
            {/* <Card radius="none" className="m-0 border-none" >
                <CardBody   className="grid grid-cols-2 gap-10 " >
                   
                        
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
            </Card> */}
               
        </section>
    </>

}