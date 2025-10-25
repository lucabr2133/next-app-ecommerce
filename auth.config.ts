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
        token.role=user.role
      }
      return token;
    },
        async session({session,token}){
            if(token){
                session.user.id=token.id as string,
                    session.user.name = token.username as string;
             session.user.email = token.email as string;
             session.user.role=token.role as string
            }
            return session
        },
        authorized({auth,request:{nextUrl}}){
            const isLogged=!!auth?.user
            const path=nextUrl.pathname
            console.log(auth?.user);
            
            if(path==='/'){
                if(isLogged) return true
                return false
            }
            else if(isLogged && path==='/login'){
                return Response.redirect(new URL('/',nextUrl))
            }
            
            else if(path==='/dashboard' && auth?.user.role==='user'){
                              return Response.redirect(new URL('/',nextUrl))

            }
            return true
        }
    },
    providers:[]
} satisfies NextAuthConfig