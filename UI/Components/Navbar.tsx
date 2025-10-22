"use client";

import { Button } from "@heroui/button";
import { Navbar, NavbarContent, NavbarItem, Input,Link, useDisclosure, Drawer} from "@heroui/react";
import {  useSearchParams,useRouter } from "next/navigation";
import {  ShoppingCartIcon} from "lucide-react";
import { useDebouncedCallback } from 'use-debounce';
import { DrawerComponent } from "./Drawer";
export function NavbarComponet(){
  
  const searchParams=useSearchParams()
  const params=new URLSearchParams(searchParams)
  const router=useRouter()
  const {isOpen,onOpen,onOpenChange} =useDisclosure()
  function onHandleSearch(search:string){
    
  if(search){
    params.set('search',search)
  }else{
    params.delete('search')
  }
  router.replace(`http://localhost:3000/games?${params.toString()}`)
  }
    return <>
    <Navbar className="flex justify-between m-0 w-full">
   
      <NavbarContent    className="sm:flex gap-4 ">
        <NavbarItem>
          <Link href="http://localhost:3000/">My ecommerce page</Link>
        </NavbarItem>
        <NavbarItem className="w-full">
            <Input   defaultValue={searchParams.get('search')?.toString()} onChange={useDebouncedCallback((e)=>{
              onHandleSearch(e.target.value)
            },500)}  className="min-w-[700px]" placeholder="Search Games..." radius="full" variant="faded" color="primary"   ></Input>
 
        </NavbarItem>
      </NavbarContent>  
      <NavbarContent  className="w-full">
        <NavbarItem>
                <Link>Home page</Link>
        </NavbarItem>
            <NavbarItem>
                <Link>About</Link>
        </NavbarItem>
            <NavbarItem>
                <Link>Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Button isIconOnly variant="flat" onPress={onOpen} ><ShoppingCartIcon></ShoppingCartIcon></Button>
        </NavbarItem>

      </NavbarContent>
  
    </Navbar>
  <DrawerComponent  isOpen={isOpen} onOpenChange={onOpenChange}>

  </DrawerComponent>
    </>  
}