import React from "react";
import "@/styles/globals.css";
import { Providers } from "./providers"
import { NavbarComponet } from "@/UI/Components/Navbar"
import { inter } from "@/fonts";
export default function layout({children}:{children:React.JSX.Element}){
    return <> 
        <html className={`${inter.className} dark text-foreground bg-background`} suppressHydrationWarning   lang="en" style={{colorScheme:'dark'}}>
        <head>
            <title>Document</title>
        </head>
        <body className={`bg-black  dark text-foreground m-0`}>
            <Providers  >
                <NavbarComponet></NavbarComponet>
                <div className=" p-0">
                {children}

                </div>


            </Providers>
        </body>
        </html>
    </>
}