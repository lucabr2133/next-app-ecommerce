import { notFound } from "next/navigation";

import { Games, sreenshoots, tags } from "@/types/database";
import MainContent from "@/components/gamesComponents/MainContent";
import { sql } from "@/supabase";

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ idGames: string }>;
}) {
  const { idGames } = await params;

  const gameRows = await sql<Games[]>`
    SELECT *
    FROM games
    WHERE games.id = ${idGames}
  `;

  if (!gameRows || gameRows.length === 0) {
    notFound();
  }

  const gameData = gameRows[0];

  const [gameTags, screenshots, relatedGames] = await Promise.all([
    sql<tags[]>`
      SELECT new_tags_game.tag_id AS tag_id, new_tags.name AS tag_name
      FROM new_tags_game
      INNER JOIN new_tags ON tag_id = new_tags.id
      WHERE new_tags_game.game_id = ${gameData.id}
    `,
    sql<sreenshoots[]>`
      SELECT DISTINCT screenshoots.id, screenshoots.screenshoot_url AS screenshot_url
      FROM screenshoots
      INNER JOIN screenshoots_game ON screenshoots_game.screenshoot_id = screenshoots.id
      WHERE screenshoots_game.game_id = ${gameData.id}
    `,
    sql<Games[]>`
      SELECT *
      FROM games
      WHERE id != ${gameData.id}
      ORDER BY metacritic DESC NULLS LAST, release_at DESC
      LIMIT 3
    `,
  ]);

  return (
    <div className="p-0 m-0">
      <MainContent
        game={gameData}
        relatedGames={relatedGames}
        screenshoots={screenshots}
        tags={gameTags}
      />
    </div>
  );
}
