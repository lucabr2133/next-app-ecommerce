"use client"
import { CartContext } from "@/app/contex/contex";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader } from "@heroui/react";
import { useContext } from "react";
import { ProductCart } from "./Card";
export function DrawerComponent({isOpen,onOpenChange}:{isOpen:boolean,onOpenChange:()=>void}){
    
    const cartContext=useContext(CartContext)
    console.log(cartContext,'a');
    
const totalPrice = Array.isArray(cartContext.cartList)
  ? cartContext.cartList.reduce((acc, game) => acc + Number(game.price), 0)
  : 0;


    
    return   <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Drawer Title</DrawerHeader>
              <DrawerBody>
                <div className="">
                    {cartContext.cartList.length===0 ? <>No hay juegos en el carrito</>:  cartContext.cartList.map((game)=>(
                    <ProductCart game={game} key={game.id}>

                    </ProductCart>
                ))}

                </div>
             
              </DrawerBody>
              <DrawerFooter>
                Total: ${totalPrice}
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Buy now
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>



    </Drawer>

}
