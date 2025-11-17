"use client";

import { Button } from "@heroui/button";
import { Navbar, NavbarContent, NavbarItem, Input,Link, useDisclosure, Drawer, Form, NavbarMenu, NavbarMenuToggle, NavbarMenuItem} from "@heroui/react";
import {  useSearchParams,useRouter, usePathname } from "next/navigation";
import {  CircleUser, ShoppingCartIcon, Sun} from "lucide-react";
import { useDebouncedCallback } from 'use-debounce';
import { DrawerComponent } from "./Drawer";
import { LogOut } from "@/services/logOut";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { ThemeSwitcher } from "./ThemeSwitcher";
export function NavbarComponet({session}:{session:Session|null}){
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const searchParams=useSearchParams()
  const params=new URLSearchParams(searchParams)
  const router=useRouter()
  const {isOpen,onOpen,onOpenChange} =useDisclosure();
  function onHandleSearch(search:string){
    
  if(search){
    params.set('search',search)
  }else{
    params.delete('search')
  }
  router.replace(`http://localhost:3000/games?${params.toString()}`)
  }
    return <>
    <Navbar className="flex justify-between  " onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent className="sm:hidden" > 
    <NavbarMenuToggle   aria-label={isMenuOpen ? "Close menu" : "Open menu"}  >

      </NavbarMenuToggle>
      </NavbarContent>
 
       <NavbarContent    className="hidden sm:flex gap-4 ">
        <NavbarItem>
          <Link href="http://localhost:3000/">My ecommerce page</Link>
        </NavbarItem>
        <NavbarItem className="">
            <Input   defaultValue={searchParams.get('search')?.toString()} onChange={useDebouncedCallback((e)=>{
              onHandleSearch(e.target.value)
            },500)}  className="" placeholder="Search Games..." radius="full" variant="faded" color="primary"   ></Input>
 
        </NavbarItem>
      </NavbarContent>  
      <NavbarContent  className="  md:flex gap-4 ">
    
            <NavbarItem>
                <Link href="/dashboard">Dashboard</Link>
        </NavbarItem>
    
         
  <NavbarItem>
    <Form action={LogOut}>
      <Button type="submit"  variant="flat" color="danger"  >Log out</Button>
    </Form>
          
        </NavbarItem>
            <NavbarItem>
          <Button isIconOnly variant="flat" onPress={onOpen} ><ShoppingCartIcon></ShoppingCartIcon></Button>
        </NavbarItem>

         <NavbarItem>
          <Button as={Link} isIconOnly variant="flat" href={`/profile/${session?.user?.name}`} ><CircleUser></CircleUser></Button>
        </NavbarItem>
               <NavbarItem>
        <ThemeSwitcher></ThemeSwitcher>
        </NavbarItem>
      </NavbarContent>  
      <NavbarMenu>
          <NavbarMenuItem>
          <Link href={process.env.NEXT_PUBLIC_API_URL}>Home</Link>
        </NavbarMenuItem>
        <NavbarMenuItem className="">
            <Input   defaultValue={searchParams.get('search')?.toString()} onChange={useDebouncedCallback((e)=>{
              onHandleSearch(e.target.value)
            },500)}  className="" placeholder="Search Games..." radius="full" variant="faded" color="primary"   ></Input>
 
        </NavbarMenuItem>
      </NavbarMenu>
  
   
  
    </Navbar>
  <DrawerComponent  isOpen={isOpen} onOpenChange={onOpenChange}>

  </DrawerComponent>
    </>  
}