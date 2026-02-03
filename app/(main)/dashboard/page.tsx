import { sql } from "@/supabase"
import { MainDashboard } from "@/components/dashboardComponents/users/mainDashboard"
import { Row } from "postgres"
export type data={
    totalUser:Row
    totalGames:Row
    totalOrders:Row
    mostSellGames:Row[],
    sales:Row[],
    totalEarnigs:Row
}
export default async function DashboardPage(){
    const [totalUser]=await sql `select COUNT(*) from users`
    const [totalGames]= await sql `select count(*) from games`
    const [totalOrders]= await sql ` select count(*) from orders where status=${'paid'}`
    const [totalEarnigs]= await sql `select sum(price) from order_items inner join games on order_items.game_id=games.id inner join orders on order_items.order_id=orders.id where orders.status='paid'`
    const sales = await sql`
   SELECT
  DATE(orders.created_at) AS date,
  SUM(games.price * order_items.quantity) AS total
FROM orders
INNER JOIN order_items
  ON order_items.order_id = orders.id
INNER JOIN games
  ON order_items.game_id = games.id
WHERE orders.status = 'paid'
GROUP BY DATE(orders.created_at)
ORDER BY date ASC;

  `;
  const mostSellGames= await sql `select count(status),title,img_url from games inner join order_items on order_items.game_id=games.id inner join orders on order_items.order_id=orders.id WHERE orders.status = 'paid' group by games.id `
  
    const data:data={
        totalUser,
        totalGames, 
        totalOrders,
        mostSellGames,
        sales,
        totalEarnigs

    }
    return <>
       <MainDashboard data={data} ></MainDashboard>
    </>
}