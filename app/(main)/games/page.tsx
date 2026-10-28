import { Games, Genres } from "@/types/database";
import { MainGames } from "@/components/gamesComponents/MainGames";
import { sql } from "@/supabase";

export const dynamic = "force-dynamic";

export default async function GamesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const rawGenre =
    typeof resolvedParams.genre === "string" ? resolvedParams.genre : undefined;
  const rawSearch =
    typeof resolvedParams.search === "string"
      ? resolvedParams.search
      : undefined;

  const genre = rawGenre && rawGenre !== "undefined" ? rawGenre : null;
  const search = rawSearch && rawSearch !== "undefined" ? rawSearch : null;

  let gamesQuery;

  if (genre && search) {
    gamesQuery = sql<Games[]>`
      SELECT DISTINCT g.*
      FROM games g
      INNER JOIN genre_games gg ON gg.game_id = g.id
      WHERE gg.genre_id = ${genre}
        AND g.title ILIKE ${"%" + search + "%"}
      ORDER BY g.release_at DESC
    `;
  } else if (genre) {
    gamesQuery = sql<Games[]>`
      SELECT DISTINCT g.*
      FROM games g
      INNER JOIN genre_games gg ON gg.game_id = g.id
      WHERE gg.genre_id = ${genre}
      ORDER BY g.release_at DESC
    `;
  } else if (search) {
    gamesQuery = sql<Games[]>`
      SELECT DISTINCT g.*
      FROM games g
      WHERE g.title ILIKE ${"%" + search + "%"}
      ORDER BY g.release_at DESC
    `;
  } else {
    gamesQuery = sql<Games[]>`
      SELECT * FROM games
      ORDER BY release_at DESC
    `;
  }

  const [data, genres] = await Promise.all([
    gamesQuery,
    sql<Genres[]>`SELECT id, name FROM genres`,
  ]);

  return <MainGames data={data} genres={genres} />;
}
