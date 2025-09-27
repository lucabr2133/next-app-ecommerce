import { sql } from "@/supabase"
import { error } from "console";

export  async function GET(request:Request,{params}:{params:{idGames:string}}){
    
    const {idGames}= await params
    
    try{
    const game=await sql`select id,title,img_url,description from games where ${idGames}=id`
    return Response.json(game)

    }catch(e){
        console.error(e);
        
        throw new Error('Something get wrong ')
    }
    
}