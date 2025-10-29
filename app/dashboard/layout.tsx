import React from "react";
import Drawer from "./(componentes)/drawer";

export default function dashboardLayout({children}:{children:React.ReactNode}){
    return<>
        <Drawer></Drawer>

         <div className="   ">

        {children}

            </div>
     
    </>
}