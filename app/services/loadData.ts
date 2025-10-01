import { Games, Screenshots } from '@/types';
import { GameDetail } from '@/types/gameDetail';
import { sql } from '@/supabase';


export async function LoadGames() {

  const [unknownCompany] = await sql`
    INSERT INTO companies (name)
    VALUES ('Unknown')
    ON CONFLICT (name) DO NOTHING
    RETURNING id
  `;
  const unknownCompanyId = unknownCompany?.id ?? (await sql`
    SELECT id FROM companies WHERE name='Unknown'
  `)[0].id;

  // Traer juegos principales
  const response = await fetch(`https://api.rawg.io/api/games?key=53c5fa302d924b35b320957cc61a057a&ordering=-added&dates=2025-01-01,2025-12-31&page=4`);
  const data: Games = await response.json();

  for (const game of data.results) {
    
    // Traer detalles específicos del juego
    const detailsResp = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${process.env.RAWG_KEY}`);
    const details: GameDetail = await detailsResp.json();

    const developerName = details.developers?.[0]?.name;
    const companyId = developerName
      ? (await sql`
          INSERT INTO companies (name)
          VALUES (${developerName})
          ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
          RETURNING id
        `)[0].id
      : unknownCompanyId;

    // Fecha de lanzamiento fallback
    const releaseDate = details.released ? new Date(details.released) : new Date('1900-01-01');

    // Insertar juego
const [insertedGame] = await sql/*sql*/`
  INSERT INTO games (title, description, img_url, release_at, price, company_id,metacritic)
  VALUES (
    ${details.name},
    ${details.description_raw || details.description},
    ${details.background_image},
    ${details.released || new Date()},
    70, 
    ${companyId},
    ${details.rating??0}
  )
  ON CONFLICT (title) DO NOTHING
  RETURNING id
`;

// Si no devolvió nada porque ya existía, buscás el id
const gameId = insertedGame?.id ?? (
  await sql`SELECT id FROM games WHERE title=${details.name}`
)[0].id;
    // Insertar plataformas
    for (const platform of details.parent_platforms ?? []) {
      const [insertedPlatform] = await sql`
        INSERT INTO platforms (name)
        VALUES (${platform.platform.name})
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      `;
      const platformId = insertedPlatform?.id ?? (await sql`
        SELECT id FROM platforms WHERE name=${platform.platform.name}
      `)[0].id;

      // Relación N:M
      await sql`
        INSERT INTO platform_games (platform_id, game_id)
        VALUES (${platformId}, ${gameId})
        ON CONFLICT DO NOTHING
      `;
    }

    // Insertar géneros
    for (const genre of details.genres ?? []) {
      const [insertedGenre] = await sql`
        INSERT INTO genres (name)
        VALUES (${genre.name})
        ON CONFLICT (name) DO NOTHING
        RETURNING id
      `;
      const genreId = insertedGenre?.id ?? (await sql`
        SELECT id FROM genres WHERE name=${genre.name}
      `)[0].id;

      await sql`
        INSERT INTO genre_games (game_id, genre_id)
        VALUES (${gameId}, ${genreId})
        ON CONFLICT DO NOTHING
      `;
    }
    // insert screenshoots
    const gameScreenShoots= await fetch(`https://api.rawg.io/api/games/${game.id}/screenshots?key=${process.env.RAWG_KEY}`)
    const dataSceenShoots:Screenshots= await gameScreenShoots.json()
    for (const screenshoots of dataSceenShoots.results??[]){
   const [insertedScreenshoot] = await sql`
  INSERT INTO screenshoots (screenshoot_url) 
  VALUES (${screenshoots.image}) 
  ON CONFLICT (screenshoot_url) DO NOTHING
  RETURNING id
`;
           const screenshootId = insertedScreenshoot?.id 
  ?? (await sql`SELECT id FROM screenshoots WHERE screenshoot_url=${screenshoots.image}`)[0].id;

await sql`
  INSERT INTO screenshoots_game (game_id, screenshoot_id) 
  VALUES (${gameId}, ${screenshootId})
`;
    }

  //insert tags
  for (const tag of details.tags) {
    const [insertedTag] = await sql`
  INSERT INTO new_tags (name) 
  VALUES (${tag.name}) 
  ON CONFLICT (name) DO NOTHING 
  RETURNING id
`;

const tagId = insertedTag?.id 
  ?? (await sql`SELECT id FROM new_tags WHERE name=${tag.name}`)[0].id;

await sql`
 INSERT INTO new_tags_game (game_id, tag_id)
VALUES (${gameId}, ${tagId})
ON CONFLICT (tag_id, game_id) DO NOTHING;

`;

  }
  
  }

  console.log('✅ Juegos cargados correctamente');
  await sql.end();
}

LoadGames().catch(console.error);
