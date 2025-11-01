"use client"
import { Table, TableBody, TableColumn,TableCell,TableHeader,TableRow } from "@heroui/react";
import postgres from "postgres";
import { useCallback } from "react";

export function MainOrders({orders}:{orders:postgres.Row[]}){
    const renderCell=useCallback((order:postgres.Row,columkey:string)=>{
        const cell=order[columkey]
        switch (columkey){
            case 'id':
                return <div >{cell}</div>
            case 'user_id':
                return <div>{cell}</div>
            case 'status':
                return <div>{cell}</div>
            case 'created_at':
                return <div>{cell}</div>
            case 'username':
                return <div>{cell}</div>
        }

    },[orders])
    const keys=Object.keys(orders[0])
    return <main className="px-10 min-h-screen flex justify-center items-center w-full ">
        <Table className="w-full">
            <TableHeader>
                {keys.map(key=>(
                    <TableColumn key={key}>
                        {key}
                    </TableColumn>
                ))}
            </TableHeader>
          <TableBody emptyContent={"No users found"} items={orders} >
        {(item) => (
          <TableRow key={item.id}   >
            {(columnKey) => <TableCell className="p-10"   >{renderCell(item,columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
        </Table>
    </main>
}