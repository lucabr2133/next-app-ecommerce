
import { sql } from "@/supabase";

export async function GET(request:Request) {
    const data=await sql `select id,name from genres`
    return Response.json(data)
}