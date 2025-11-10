import { auth } from "@/auth";
import bcrypts from 'bcryptjs'
import { sql } from "@/supabase";
export async function  POST(request:Request){
    const session=await auth()
    if(session?.user?.role!='admin'){
        return Response.json('unauthorized',{status:404})
    }
    const {username,password,email}=await request.json()
    const hashPassword=await  bcrypts.hash(password,10)
    try { 
        await sql `insert into users (username,role,email,password) values (
            ${username},'admin',${email},${hashPassword},
        ) `
    } catch (e) {
        Response.json({error:"somenthing unexpected happent"},{status:400})
    }
}