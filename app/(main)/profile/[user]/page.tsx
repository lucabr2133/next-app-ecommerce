import { redirect } from "next/navigation";

import { auth, User } from "@/auth";
import { MainProfile } from "@/components/profileComponents/mainProfile";
import { sql } from "@/supabase";

export const dynamic = "force-dynamic";

export default async function ProfilePage(props: {
  params: Promise<{ user: string }>;
}) {
  await props.params;
  const session = await auth();

  if (!session?.user?.name || !session?.user?.id) {
    redirect("/login");
  }

  const users = await sql<User[]>`
    SELECT * FROM users WHERE users.id = ${session.user.id}
  `;
  const userData = users[0];

  if (!userData) {
    redirect("/login");
  }

  const orderData = await sql`
    SELECT
      o.id AS order_id,
      o.status,
      o.created_at,
      COUNT(oi.id) AS items_count,
      COALESCE(SUM(g.price * COALESCE(oi.quantity, 1)), 0) AS total
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN games g ON oi.game_id = g.id
    WHERE o.user_id = ${session.user.id}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

  return <MainProfile orderData={orderData} user={userData} />;
}
