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
export async function DELETE(request:Request,{params}:{params:{userId:string}}){
    const {userId}=await params
    await sql `DELETE FROM users where id=${userId} ON CASCADE`
    return Response.json({
        message:'user delete succesfully'
    },{status:200})
}