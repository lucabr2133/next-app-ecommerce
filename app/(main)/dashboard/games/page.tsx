import MainGamesAdmin from "@/components/dashboardComponents/games/MainGamesAdmin";
import { sql } from "@/supabase";
import { Games } from "@/types/database";

export const dynamic = "force-dynamic";

export default async function PageGame() {
  const data = await sql<Games[]>`
    SELECT * FROM games ORDER BY release_at DESC
  `;

  return <MainGamesAdmin games={data} />;
}
