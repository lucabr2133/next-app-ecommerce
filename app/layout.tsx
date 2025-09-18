import React from "react";
import "@/styles/globals.css";
import { Providers } from "./providers"
import { NavbarComponet } from "@/UI/Components/Navbar"
import { inter } from "@/UI/fonts";
export default function layout({children}:{children:React.JSX.Element}){
    return <> 
        <html suppressHydrationWarning   lang="en" style={{colorScheme:'dark'}}>
        <head>
            <title>Document</title>
        </head>
        <body className={`${inter.className} min-h-dvh dark text-foreground bg-background`}>
            <Providers  >
                <NavbarComponet></NavbarComponet>
                {children}

            </Providers>
        </body>
        </html>
    </>
}