import { Row } from "postgres";

import { sql } from "@/supabase";
import { MainDashboard } from "@/components/dashboardComponents/users/mainDashboard";

export const dynamic = "force-dynamic";

export type data = {
  totalUser: Row;
  totalGames: Row;
  totalOrders: Row;
  mostSellGames: Row[];
  sales: Row[];
  totalEarnigs: Row;
};

export default async function DashboardPage() {
  const [totalUser] = await sql`SELECT COUNT(*) FROM users`;
  const [totalGames] = await sql`SELECT COUNT(*) FROM games`;
  const [totalOrders] = await sql`
    SELECT COUNT(*) FROM orders WHERE status = 'paid'
  `;
  const [totalEarnigs] = await sql`
    SELECT COALESCE(SUM(games.price * COALESCE(order_items.quantity, 1)), 0) AS sum
    FROM order_items
    INNER JOIN games ON order_items.game_id = games.id
    INNER JOIN orders ON order_items.order_id = orders.id
    WHERE orders.status = 'paid'
  `;
  const sales = await sql`
    SELECT
      DATE(orders.created_at) AS date,
      SUM(games.price * COALESCE(order_items.quantity, 1)) AS total
    FROM orders
    INNER JOIN order_items ON order_items.order_id = orders.id
    INNER JOIN games ON order_items.game_id = games.id
    WHERE orders.status = 'paid'
    GROUP BY DATE(orders.created_at)
    ORDER BY date ASC
  `;
  const mostSellGames = await sql`
    SELECT games.id, COUNT(orders.status) AS count, games.title, games.img_url
    FROM games
    INNER JOIN order_items ON order_items.game_id = games.id
    INNER JOIN orders ON order_items.order_id = orders.id
    WHERE orders.status = 'paid'
    GROUP BY games.id
    ORDER BY count DESC
    LIMIT 10
  `;

  const dashboardData: data = {
    totalUser,
    totalGames,
    totalOrders,
    mostSellGames,
    sales,
    totalEarnigs,
  };

  return <MainDashboard data={dashboardData} />;
}
