
import {  Games } from "@/types/database";
import { Button, Card, CardFooter, CardHeader, Link ,Image, CardBody} from "@heroui/react";
import { CartContext } from "@/app/contex/contex";
import { useContext } from "react";
export function ShopIcon(){
      return  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
</svg>
}
export function ShopCart({game}:{game:Games}){
    const cartContext=useContext(CartContext)


    
    return         <Card  className= {`my-5 mx-2 min-h-68 cursor-pointer border-1 border-black-600   `}  >
                <CardBody className="grid grid-cols-2 h-full">
                     <Image
        
          alt="Card background"
          className="z-0 h-full w-full" 
          src={game.img_url}
        />
        <div className="flex flex-col p-5">
            <h2 className="text-center">{game.title}+</h2>
            <p>{game.description.length>200?game.description.slice(0,200)+'...':game.description}</p>
            <div className="grid grid-cols-3 place-items-center h-full">
  { cartContext.cartList.some((gameCart) => gameCart.id === game.id)?   <Button onPress={()=>{
                        const newcCart=cartContext.cartList.filter(gameCart=>gameCart.id!=game.id)
                        cartContext.setCartList(newcCart)
                }} as={Link}  className="m-2" size='sm' variant="flat"  color="danger">
                        <ShopIcon></ShopIcon>
                        Delete to cart

                </Button>  : <Button onPress={async()=>{
                        await fetch('/api/orders',{
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
                        <h2 className="text-center flex justify-center content-center">${game.price}</h2>    
            </div>
 
        </div>

                </CardBody>
                    
      

      
      </Card>
        
}
