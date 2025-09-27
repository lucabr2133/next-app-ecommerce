import { sql } from "@/supabase"
export async function GET(request:Request) {
     const url = new URL(request.url);      // req.url contiene la URL completa
  const quantity = url.searchParams.get("quantity"); // "123
    
    const data=await sql`SELECT * from games ORDER BY release_at desc LIMIT ${quantity}`
    
   return  Response.json(data)
}
