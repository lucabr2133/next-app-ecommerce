"use client"
import { CartContext } from "@/app/contex/contex";
import { Button, Drawer, DrawerBody, DrawerContent, DrawerFooter, DrawerHeader, Link } from "@heroui/react";
import { useContext } from "react";
import { ProductCart } from "./Card";
export function DrawerComponent({isOpen,onOpenChange}:{isOpen:boolean,onOpenChange:()=>void}){
    
    const cartContext=useContext(CartContext)
const totalPrice = cartContext.cartList.reduce(
  (acc, game) => acc + Number(game.price),
  0
);

    
    return   <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">My Cart</DrawerHeader>
              <DrawerBody>
                <div className=""   >
  {
                cartContext.cartList.map((game)=>(
                    <ProductCart game={game} key={game.id}>

                    </ProductCart>
                ))
               }
                </div>
             
              </DrawerBody>
              <DrawerFooter>
                Total: ${totalPrice}
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" as={Link} href="/checkout">
                  Buy now
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>



    </Drawer>

}
