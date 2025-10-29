"use client"
import { Link } from "@heroui/react";
import { Gamepad, NotepadText, User2Icon } from "lucide-react";
import { ReactNode } from "react";

export default function Drawer(){
    const size=35
    return <>
    
      <aside className="h-screen  border-r-1 w-1/6">
        <ul>
          <LiComponent text="Users" href="/users">
            <User2Icon height={size} width={size}></User2Icon>
          </LiComponent>    
            <LiComponent text="games"href="/games">
                <Gamepad height={size} width={size}></Gamepad>
            </LiComponent>
            <LiComponent text="orders" href="/orders" >
                <NotepadText height={size} width={size}></NotepadText>
            </LiComponent>
        </ul>
        </aside>
    </>
}
function LiComponent({children,text,href}:{children:ReactNode,text:string,href:string}){
    return <Link href={'/dashboard'+href} className="text-gray-50 flex w-full h-[90px] items-center font-extrabold p-5 gap-5 text-3xl cursor-pointer capitalize transition-all  duration-200 hover:bg-blue-400/40">
        {children}
        {text}

    </Link>
    
}