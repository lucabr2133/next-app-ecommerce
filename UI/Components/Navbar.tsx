"use client";

import { Navbar,NavbarBrand,NavbarContent,NavbarItem } from "@heroui/navbar";
import {  Link} from "@heroui/link";
import { Button } from "@heroui/button";
export function NavbarComponet(){
    return  <Navbar>
   
      <NavbarContent justify='start' className=" sm:flex gap-4">
        <NavbarItem>
            <h2>My Eccomerce page</h2>
            
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