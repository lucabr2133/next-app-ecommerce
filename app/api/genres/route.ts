
import { sql } from "@/supabase";

export async function GET(request:Request) {
    try {
    const data=await sql `select id,name from genres`
    return Response.json(data)
        
    } catch (e) {
        console.error(e)
        return Response.json({error:'An error occurred getting genres'},{status:400})
    }
}