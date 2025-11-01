import { validateSchema } from "@/app/schemas";
import { sql } from "@/supabase";
import { createClient } from '@supabase/supabase-js'
import {z} from 'zod'
const supabase=createClient(process.env.SUPABASE_URL as string,process.env.SUPABASE_SERVICE_ROLE_KEY as string)
export async function GET(request: Request) {
  const url = new URL(request.url);

  const order = url.searchParams.get("order") ?? "release_at";
  const quantity = url.searchParams.get("quantity");
const genre= url.searchParams.get('genre')
const search= url.searchParams.get('search')
  // Validar columna de orden
  const validOrders = ["release_at", "rating", "price"];
  if (!validOrders.includes(order)) {
    return new Response(JSON.stringify({ error: "Invalid order parameter" }), { status: 400 });
  }

  // Construir la query base
  let query = sql`
    SELECT * FROM games
    ORDER BY ${sql(order)} DESC
  `;

  // Agregar el límite si corresponde
  if (quantity && quantity !== "all" && Number(quantity) > 0) {
    query = sql`
      SELECT DISTINCT * FROM games
      ORDER BY ${sql(order)} DESC
      LIMIT ${Number(quantity)}
    `;
  }
  if(genre && genre!='undefined'){
    console.log(genre,'a');
    
query = sql`
  SELECT DISTINCT g.*
  FROM games g
  INNER JOIN genre_games gg
    ON g.id = gg.game_id
  WHERE gg.genre_id = ${genre}
`;
  }
if (search&&search !== 'undefined' ) {

  query = sql`
    SELECT DISTINCT g.*
    FROM games g
    WHERE  g.title ILIKE ${search + '%'}
  `;
}
if(search && search !== 'undefined'&&genre && genre!='undefined'){
  console.log(search,genre);
  
  query = sql`
    SELECT DISTINCT g.*
    FROM games g
    INNER JOIN genre_games
    ON genre_games.game_id=g.id
    WHERE genre_games.genre_id=${genre}
    AND g.title ILIKE ${search + '%'}
  `;
}
  // Ejecutar la consulta
  const data = await query;
  
  return Response.json(data);
}
export async function POST(request:Request) {
  const formdata=await request.formData()
  const file = formdata.get("file") as File ;
        if (!file) {
      return Response.json({ error: "No se envió ninguna imagen" }, { status: 400 });
    }
 const validateFormSchema=validateSchema(formdata)
 if(!validateFormSchema.success){
  const flaterned=z.flattenError(validateFormSchema.error)
  return Response.json({success:false,errors:flaterned},{status:400})
 }
  const filePath = `uploads/${Date.now()}-${file?.name}`;
  const validateData=validateFormSchema.data
  try {
      const { data, error } = await supabase.storage.from("games").upload(filePath, file);
      if (error) throw error;
      const companyName =validateData.company_name.charAt(0).toUpperCase() +validateData.company_name.slice(1).toLowerCase();
      let [company] = await sql` SELECT * FROM companies WHERE name = ${companyName};`;
      if (!company) {
      const result = await sql`
        INSERT INTO companies (name)
        VALUES (${companyName})
        ON CONFLICT (name) DO NOTHING
        RETURNING *;
      `;
       company = result[0];
}
      const { data: publicUrl } = supabase.storage.from("games").getPublicUrl(filePath);
      await sql`insert into games (company_id,title,description,price,release_at,stock,updated_at,metacritic,img_url) values (
              ${company.id},${validateData.title},${validateData.description},
              ${(validateData.price)},${new Date(validateData.release_at)},${validateData.stock},${new Date(validateData.updated_at)},
              ${(validateData.metacritic)},${publicUrl.publicUrl }
           )`
      return Response.json(
      {
      message:"game created succesfully",
      url:data?.path
      })
      } catch (error) {
         console.error(error);
    return Response.json({ error: "Error al subir la imagen" }, { status: 500 });
      }

}