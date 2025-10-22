import type { NextAuthConfig } from "next-auth";
export const authConfig ={
    pages:{
        signIn:'/login'
    },
    callbacks:{
        authorized({auth,request:{nextUrl}}){
            const isLogged=!!auth?.user
            const path=nextUrl.pathname
            if(path==='/'){
                if(isLogged) return true
                return false
            }
            else if(isLogged){
                return Response.redirect(new URL('/',nextUrl))
            }
            return true
        }
    },
    providers:[]
} satisfies NextAuthConfig