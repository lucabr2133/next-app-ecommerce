import { sql } from "@/supabase"
import { error } from "console";

export  async function GET(request:Request,{params}:{params:{idGames:string}}){
    
    const {idGames}= await params
    
    try{
    const game=await sql`SELECT games.id,games.title,games.img_url,games.description from games  where games.id=${idGames}`
    const tags= await sql `select new_tags_game.tag_id as tag_id, new_tags.name as tag_name from new_tags_game inner join new_tags on tag_id=new_tags.id where new_tags_game.game_id=${game[0].id}`
    const screenshots=await sql `select distinct screenshoots.screenshoot_url as screenshot_url from screenshoots inner join screenshoots_game on screenshoots_game.screenshoot_id=screenshoots.id where screenshoots_game.game_id=${game[0].id}`


    
    return Response.json({game,tags,screenshots})

    }catch(e){
        console.error(e);
        
        throw new Error('Something get wrong ')
    }
    
}