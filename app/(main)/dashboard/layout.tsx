import React from "react";
import Drawer from "@/components/dashboardComponents/drawer";

export default function dashboardLayout({children}:{children:React.ReactNode}){
    return<>
        <Drawer></Drawer>

         <div className="   ">

        {children}

            </div>
     
    </>
}