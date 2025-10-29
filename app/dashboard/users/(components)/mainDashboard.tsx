import { data } from "../../page";

export async function MainDashboard({data}:{data:data}) {
    const {totalUser,totalGames,totalOrders}=data
    return <>
    
     <main className="h-screen p-24 w-full">
            <ul>
                <div className="flex w-full  justify-between gap-5">
                    <div className=" min-h-[200px]  min-w-1/3  rounded-2xl px-5 bg-blue-400/50 py-5">
                        <h2 className="text-white font-extrabold text-2xl uppercase tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Total users :{totalUser.count}
                        </h2>
                    </div>
                   <div className=" min-h-[200px]  min-w-1/3  rounded-2xl px-5 bg-blue-400/50 py-5">
                        <h2 className="text-white font-extrabold text-2xl uppercase tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Total Games :{totalGames.count}
                        </h2>
                    </div>
                   <div className=" min-h-[200px]  min-w-1/3  rounded-2xl px-5 bg-blue-400/50 py-5">
                        <h2 className="text-white font-extrabold text-2xl uppercase tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            Total Orders :{totalOrders.count}
                        </h2>
                    </div>
                </div>
              
            </ul>

        </main>
    </>
    
}