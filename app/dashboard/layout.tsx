import React from "react";
import Drawer from "./(componentes)/drawer";

export default function dashboardLayout({children}:{children:React.ReactNode}){
    return<>
    <div className="flex ">
        <Drawer></Drawer>
        {children}
    </div>
     
    </>
}