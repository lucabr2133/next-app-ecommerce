
import {  Games } from "@/types/database";
import { Button, Card, CardFooter, CardHeader, Link ,Image} from "@heroui/react";
import { CartContext } from "@/app/contex/contex";
import { useContext } from "react";
export function ShopIcon(){
      return  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
}
export function ProductCart({game}:{game:Games}){
    const cartContext=useContext(CartContext)


    
    return         <Card  className= {`my-5 mx-2 w-100 h-68 cursor-pointer border-y-1 border-y-amber-500  `}  style={{
        transition:'all 0.5s ease'
    }}>
              
               <Card className="col-span-12 sm:col-span-4 h-[300px]">
        <CardHeader className="absolute z-10 top-1 flex-col items-start! ">
                
                {game.title!=='See more'&&<p className="text-4xl md:text-tiny font-extrabold uppercase tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{game.title}</p>}

        </CardHeader>
                        {game.title!=='See more'?  <Image
          removeWrapper
          alt="Card background "
          className="z-0 "
          src={game.img_url}
        />:<Link href="http://localhost:3000/games" className="flex justify-center items-center  h-full cursor-pointer ">
                <h2 className="  ">{game.title}+</h2>
                </Link>}
       <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
        {game.title!=='See more'&&  <CardFooter className="flex  z-10 ">    
                { cartContext.cartList.some((gameCart) => gameCart.id === game.id)?   <Button onPress={async()=>{
                         await fetch('http://localhost:3000/api/orders',{
                                method:'DELETE',
                                headers:{
                                        'Content-Type': 'application/json',
                                },
                                
                                body:JSON.stringify({ gameId:game.id }),
                                        
                                       
                                
                        })
                        const newcCart=cartContext.cartList.filter(gameCart=>gameCart.id!=game.id)
                        cartContext.setCartList(newcCart)
                }} as={Link}  className="m-2" size='sm' variant="flat"  color="danger">
                        <ShopIcon></ShopIcon>

                        Delete to Cart
                </Button>  : <Button onPress={async()=>{
                        await fetch('http://localhost:3000/api/orders',{
                                method:'POST',
                                headers:{
                                        'Content-Type': 'application/json',
                                },
                                
                                body:JSON.stringify({ game }),
                        })
                        const newcCart=[...cartContext.cartList,game]
                        cartContext.setCartList(newcCart)

                }} as={Link}  className="m-2" size='sm' variant="flat"  color="primary">
                        <ShopIcon></ShopIcon>

                        Add to cart
                </Button> }    
                <Button as={Link} href={`/games/${game.id}`}  className="m-2" size='sm' variant="flat"  color="primary">
                        View Details
                        </Button>
                        <h2>${game.price}</h2>
        </CardFooter>}
      
      </Card>
            </Card>
        
}
