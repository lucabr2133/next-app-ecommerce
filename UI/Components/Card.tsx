
import {  Games } from "@/types/database";
import { Button } from "@heroui/button";
import {Card,CardBody,CardFooter,CardHeader  } from "@heroui/card";
import {Image  } from "@heroui/image";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link } from "@heroui/link";
export function ShopIcon(){
      return  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
}
export function         ProductCart({game}:{game:Games}){

    
    return         <Card  className= {`w-100 h-70 cursor-pointer    `}  >
              
               <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col items-start! ">
                
                {game.title!=='See more'&&<p className="text-tiny text-gray-50 uppercase font-bold">{game.title}</p>}


        </CardHeader>
                        {game.title!=='See more'?  <Image
        
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={game.img_url}
        />:<div className="flex justify-center items-center  h-full ">
                <h2 className="  ">{game.title}+</h2>
                </div>}
      
        {game.title!=='See more'&&  <CardFooter>        
                <Button as={Link}  className="m-2" size='sm' variant="flat"  color="primary">
                        <ShopIcon></ShopIcon>

                        Add to cart
                </Button>
               
                <Button as={Link} href={`http://localhost:3000/games/${game.id}`}  className="m-2" size='sm' variant="flat"  color="primary">

                        Buy now
                        </Button>
        </CardFooter>}
      
      </Card>
            </Card>
        
}
