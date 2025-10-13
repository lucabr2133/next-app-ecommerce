import { sql } from "@/supabase";

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
  console.log(data);
  
  return Response.json(data);
}
