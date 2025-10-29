"use client"
import { User } from "@/auth";
import { Table,TableBody,TableColumn,TableCell,TableRow, TableHeader ,getKeyValue, Button,Select,SelectItem} from "@heroui/react";
import { Edit } from "lucide-react";
import { it } from "node:test";
import { useCallback } from "react";
export default function usersTable({users}:{users:User[]}){
    const columns=Object.keys(users[0]).filter(value=>value!='id' && value!='created_at' && value!='img_url' && value!='is_active')
    const renderCell=useCallback((user:User,columnKey:React.Key)=>{
          const cellValue = user[columnKey as keyof User];
          switch(columnKey){
            case "username":
            return user.username
             
             case "password":{
                return user.password
               
             }
             case "email":{
                return  user.email
               
             }
             case "role":{
                return <div className="flex gap-5 w-full">
                    <Select aria-label="Select role" defaultSelectedKeys={[user.role]} className="w-full" onSelectionChange={async(key)=>{
                        const [selectedKey]=Array.from(key)
                        await fetch(`http://localhost:3000/api/users/${user.id}`,{
                            method:'PATCH',
                            headers:{
                                'Content-type':'Application/json'
                            },
                            body:JSON.stringify({
                                role:selectedKey
                            })
                        })
                        
                    }}>
                        <SelectItem key={user.role}>
                              {user.role}
                        </SelectItem>
                          <SelectItem key={user.role=='admin'?'user':'admin'}>
                              {user.role=='admin'?'user':'admin'}
                        </SelectItem>
                    </Select>
                    <Button color={user.is_active?'danger':'success'} variant="flat" onPress={async()=>{
                      console.log('a');
                      
                        await fetch(`http://localhost:3000/api/users/${user.id}`,{
                            method:'PUT',
                            headers:{
                              'content-type':'Application/json'
                            },
                            body:JSON.stringify({
                              isActive:user.is_active==true?false:true
                            })
                        })
                    }}>
                        {user.is_active==true?'DISABLE':'ENABLE'}

                    </Button>
                </div>
                
             }
             case 'img_url': {
                return user.img_url
                
             }
          
          }
    },[])
    return <>
      <Table  aria-label="Example table with dynamic content">
      <TableHeader>
        {columns.map((column) =>
          <TableColumn className="font-extrabold uppercase p-5 text-2xl " key={column}>{column}</TableColumn>
        )}

      </TableHeader>
     <TableBody emptyContent={"No users found"} items={users} >
        {(item) => (
          <TableRow key={item.id} className="w-full h-full" >
            {(columnKey) => <TableCell className=" h-full">{renderCell(item,columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </>
}