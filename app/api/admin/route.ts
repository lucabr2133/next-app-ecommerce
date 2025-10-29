import { auth } from "@/auth";
import { useSearchParams } from "next/navigation";
import bcrypts from 'bcryptjs'
import { sql } from "@/supabase";
export async function  POST(request:Request){
    const session=await auth()
    if(session?.user?.role!='admin')return Response("unauthorized",{status:403})
    const {username,password,email}=await request.json()
    const hashPassword=await  bcrypts.hash(password,10)
    try {
        await sql `insert into users (username,role,email,password) values (
            ${username},'admin',${email},${password},
        ) `
    } catch (e) {
        throw new Error('Something unexpected happened')
    }
}