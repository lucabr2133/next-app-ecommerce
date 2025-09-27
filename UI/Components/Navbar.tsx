"use client";

import { Navbar,NavbarBrand,NavbarContent,NavbarItem } from "@heroui/navbar";
import {Input} from '@heroui/input'
import {  Link} from "@heroui/link";
import { Button } from "@heroui/button";
export function NavbarComponet(){
    return  <Navbar className="flex">
   
      <NavbarContent justify='start' className=" sm:flex gap-4 ">
        <NavbarItem>
          <Link href="http://localhost:3000/">My ecommerce page</Link>
        </NavbarItem>
        <NavbarItem className="w-full">
            <Input placeholder="Search..." radius="none" ></Input>

        </NavbarItem>
      </NavbarContent>  
      <NavbarContent  justify="end">
        <NavbarItem>
                <Link>Home page</Link>
        </NavbarItem>
            <NavbarItem>
                <Link>About</Link>
        </NavbarItem>
            <NavbarItem>
                <Link>Dashboard</Link>
        </NavbarItem>
      </NavbarContent>
  
    </Navbar>
}