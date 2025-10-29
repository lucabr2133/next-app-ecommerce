import { sql } from "@/supabase"

export async function  PATCH(request:Request,{params}:{params:{userId:string}}){
    const {userId}=await params
    const {role}=await request.json()
    console.log(role,userId);
    
    const user=await sql `update users set role=${role} where id=${userId}`
    return Response.json({
        message:'user role updated'
    },{status:201})
}
export async function PUT(request:Request,{params}:{params:{userId:string}}){
    
    const {userId}=await params
    const {isActive}=await request.json()
    await sql `update users set is_active=${isActive} where id=${userId}`
    return Response.json({
        message:'user update succesfully'
    },{status:200})
}