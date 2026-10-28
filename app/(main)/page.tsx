import { Games, Genres } from "@/types/database";
import { MainHome } from "@/components/globalComponents/Main";
import { sql } from "@/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [data, data30Games, dataGenres] = await Promise.all([
    sql<Games[]>`SELECT * FROM games ORDER BY release_at DESC LIMIT 10`,
    sql<Games[]>`SELECT * FROM games ORDER BY release_at DESC LIMIT 27`,
    sql<Genres[]>`SELECT id, name FROM genres`,
  ]);

  return (
    <MainHome
      data={data}
      data30Games={data30Games}
      dataGenres={dataGenres}
    />
  );
}
