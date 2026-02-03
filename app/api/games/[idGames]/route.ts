import { validateUpdateFormSchema } from "@/app/(main)/schemas";
import { auth } from "@/auth";
import { sql } from "@/supabase"
import { createClient } from "@supabase/supabase-js";
import { error } from "console";
import z, { success } from "zod";
const supabase=createClient(process.env.SUPABASE_URL as string,process.env.SUPABASE_SERVICE_ROLE_KEY as string)

export  async function GET(request:Request,{params}:{params:Promise<{idGames:string}>}){
    const session=await auth()
    if(!session?.user)return Response.json({error:'Unauthorized'},{status:403})
    const {idGames}= await params
    
    try{
    const game=await sql`SELECT games.id,games.title,games.img_url,games.description, games.price from games  where games.id=${idGames}`
    const tags= await sql `select new_tags_game.tag_id as tag_id, new_tags.name as tag_name from new_tags_game inner join new_tags on tag_id=new_tags.id where new_tags_game.game_id=${game[0].id}`
    const screenshots=await sql `select distinct screenshoots.screenshoot_url as screenshot_url from screenshoots inner join screenshoots_game on screenshoots_game.screenshoot_id=screenshoots.id where screenshoots_game.game_id=${game[0].id}`


    
    return Response.json({game,tags,screenshots})

    }catch(e){
        console.error(e);
        
        Response.json({error:'A fail occurred getting the game'},{status:400})
    }
    
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ idGames: string }> }
) {
  const { idGames } =await params;
 const session=await auth()
    if(!session?.user)return Response.json({error:'Unauthorized'},{status:403})
  if (!idGames) {
    return Response.json({ error: "No idGame provided" }, { status: 400 });
  }

  try {
    const [game]=await sql`Delete  FROM games WHERE id = ${idGames} RETURNING *`;
    
    return Response.json({ message: "Game deleted successfully" ,game}, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
export async function PATCH(request:Request,{params}:{params:Promise<{idGames:string}>}) {
   const session=await auth()
    if(!session?.user)return Response.json({error:'Unauthorized'},{status:403})
    const {idGames}=await params
      if (!idGames) {
    return Response.json({ error: "No idGame provided" }, { status: 400 });
  }

    const formData=await request.formData()
    const file=formData.get('file') as File
    if(!file)return Response.json({error:'File must be provided'},{status:400})
    const validFormSchema=validateUpdateFormSchema(formData)

    if(!validFormSchema.success){
        const flatterSchema=z.flattenError(validFormSchema.error)
        return Response.json({errors:flatterSchema.fieldErrors,success:false},{status:400})
    }

    try {
        const validateData=validFormSchema.data
        const filePath=`updated/${Date.now()}${file.name}`
        const {data,error}=await supabase .storage.from('games').upload(filePath,file)
        if(error) throw error
        const {data:publicUrl}= supabase.storage.from('games').getPublicUrl(filePath)
        const [game]=await sql `UPDATE games SET title=${validateData.title} , stock=${validateData.stock} 
        ,description=${validateData.description} ,metacritic=${validateData.metacritic} ,
       updated_at= ${validateData.updated_at},price= ${validateData.price},img_url=${publicUrl.publicUrl} where id=${idGames} returning *`
       return Response.json({message:"Game update Succesfully",success:true,game},{status:201}) 

    } catch (error) {
        console.error(error);
        
        return Response.json({error:'Failed to update the game',success:false},{status:400})
    }
}