"use client"
import { User } from "@/auth";
import { Table, TableBody, TableColumn, TableCell, TableRow, TableHeader, Button, Select, SelectItem, Chip, Divider } from "@heroui/react";
import { Users, Shield, UserX, UserCheck } from "lucide-react";
import { useCallback, useState } from "react";

export default function UsersTable({users: initialUsers}:{users:User[]}){
    const [users, setUsers] = useState<User[]>(initialUsers);
    
    // We filter out id, created_at, img_url, is_active for columns
    const columns = Object.keys(initialUsers[0] || {}).filter(value => !['id', 'created_at', 'img_url', 'is_active'].includes(value));
    
    const renderCell = useCallback((user:User, columnKey:React.Key) => {
        switch(columnKey){
            case "username":
                return (
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                            {user.img_url ? (
                                <img src={user.img_url} alt={user.username} className="w-full h-full object-cover" />
                            ) : (
                                user.username.charAt(0).toUpperCase()
                            )}
                        </div>
                        <span className="font-semibold text-sm">{user.username}</span>
                    </div>
                );
             case "password":
                return <span className="text-default-400 font-mono text-xs">••••••••</span>;
             case "email":
                return <span className="text-sm text-default-600">{user.email}</span>;
             case "role":
                return (
                    <div className="flex gap-2 w-full max-w-[250px] items-center">
                        <Select 
                            aria-label="Select role" 
                            defaultSelectedKeys={[user.role]} 
                            size="sm"
                            variant="flat"
                            className="w-32"
                            classNames={{
                                trigger: "bg-default-100 shadow-none border border-default-200/50"
                            }}
                            startContent={<Shield className="w-4 h-4 text-default-400" />}
                            onSelectionChange={async(key)=>{
                                const [selectedKey] = Array.from(key)
                                await fetch(`/api/users/${user.id}`, {
                                    method: 'PATCH',
                                    headers: {
                                        'Content-type': 'Application/json'
                                    },
                                    body: JSON.stringify({
                                        role: selectedKey
                                    })
                                })
                            }}
                        >
                            <SelectItem key="admin">admin</SelectItem>
                            <SelectItem key="user">user</SelectItem>
                        </Select>
                        
                        <Button 
                            size="sm"
                            isIconOnly
                            variant="flat"
                            color={user.is_active ? 'danger' : 'success'} 
                            title={user.is_active ? 'Disable User' : 'Enable User'}
                            onPress={async() => {
                                await fetch(`/api/users/${user.id}`, {
                                    method: 'PUT',
                                    headers: {
                                      'content-type': 'Application/json'
                                    },
                                    body: JSON.stringify({
                                      isActive: !user.is_active
                                    })
                                })
                                // Update local state for immediate feedback
                                setUsers(prev => prev.map(u => u.id === user.id ? {...u, is_active: !user.is_active} : u))
                            }}
                        >
                            {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                    </div>
                );
            default:
                return null;
        }
    }, [])

    return (
        <main className="min-h-screen p-4 md:p-10 w-full flex flex-col gap-8 bg-background relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

            <header className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-teal-500/10 rounded-xl">
                        <Users className="text-teal-500 w-6 h-6" />
                    </div>
                    <h2 className="font-bold text-3xl tracking-tight">Users Management</h2>
                </div>
                <p className="text-default-500 text-sm pl-12">Manage your community and user roles</p>
                <Divider className="my-4 opacity-50" />
            </header>

            <div className="w-full bg-content1/40 backdrop-blur-md rounded-2xl shadow-sm border border-default-200/50">
                <Table 
                    aria-label="Users Table"
                    className="w-full"
                    isStriped={false}
                    removeWrapper
                    classNames={{
                        th: "bg-default-100/50 text-default-500 text-xs font-bold uppercase tracking-wider h-12",
                        td: "py-4 border-b border-default-100 last:border-b-0"
                    }}
                >
                    <TableHeader>
                        {columns.map((column) =>
                            <TableColumn key={column}>{column.replace('_', ' ')}</TableColumn>
                        )}
                    </TableHeader>
                    <TableBody emptyContent={"No users found"} items={users}>
                        {(item) => (
                            <TableRow key={item.id} className="hover:bg-default-50/50 transition-colors">
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </main>
    )
}