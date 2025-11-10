import { sql } from "@/supabase"
import { error } from "console"

export async function  PATCH(request:Request,{params}:{params:Promise<{userId:string}>}){
    const {userId}=await params
    const {role}=await request.json()
    if(!userId || !role) return Response.json({error:'Data is missing'},{status:400})
    try {
             const user=await sql `update users set role=${role} where id=${userId}`
    return Response.json({
        message:'user role updated'
    },{status:201})
    } catch (e) {
        return Response.json({
            error:"Failed to update user"
        })
    }
   
}
export async function PUT(request:Request,{params}:{params:Promise<{userId:string}>}){
    
    const {userId}=await params
    const {isActive}=await request.json()
    if(!userId ) return Response.json({error:'Data is missing'},{status:400})
    try {
    await sql `update users set is_active=${isActive} where id=${userId}`
    return Response.json({
        message:'user update succesfully'
    },{status:200})
    } catch (e) {
        console.error(e);
        
        return Response.json({error:'failed to update the user'},{status:400})
    }

}