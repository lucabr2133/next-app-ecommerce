"use server"

import { signOut } from "@/auth"

export  async function LogOut(){
    try {
        await signOut({
        redirectTo:'/login'
      })
    } catch (error) {
        console.error(error)
    }
      
}