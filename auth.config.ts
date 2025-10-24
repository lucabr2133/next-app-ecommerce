import type { NextAuthConfig } from "next-auth";
export const authConfig ={
    pages:{
        signIn:'/login'
    },
    callbacks:{
         async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
        token.email = user.email;
      }
      return token;
    },
        async session({session,token}){
            if(token){
                session.user.id=token.id as string,
                    session.user.name = token.username as string;
             session.user.email = token.email as string;
            }
            return session
        },
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