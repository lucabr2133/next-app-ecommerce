import { sql } from "@/supabase"
import { MainDashboard } from "@/components/dashboardComponents/users/mainDashboard"
import { Row } from "postgres"
export type data={
    totalUser:Row
    totalGames:Row
    totalOrders:Row
}
export default async function DashboardPage(){
    const [totalUser]=await sql `select COUNT(*) from users`
    const [totalGames]= await sql `select count(*) from games`
    const [totalOrders]= await sql ` select count(*) from orders where status=${'paid'}`
    const data:data={
        totalUser,
        totalGames,
        totalOrders
    }
    return <>
       <MainDashboard data={data} ></MainDashboard>
    </>
}