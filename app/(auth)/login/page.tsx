"use client"
import { Button, Form, Input, Link } from "@heroui/react";

import { useSearchParams } from "next/navigation";
import { authenticate } from "@/services/authenticate";
import { useActionState } from "react";

export  default function LoginPage(){
     const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const [state,formAction]=useActionState(authenticate,undefined)

return <>
    <main className="h-screen flex items-center justify-center">
        <Form className="min-w-1/4 flex  gap-5 border-1 p-12 rounded-2xl " action={formAction}>
        <h2 className="text-center">Log in</h2>
        <Input placeholder="username" name="username" label='type your user'></Input>
        <Input placeholder="password" name="password" label='type your password'></Input>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button type="submit" color="primary">Send</Button>
        {state && (
            <>
              <p className="text-sm text-red-500">{state}</p>
            </>
          )}
          <Link href='/sign'>Sign up</Link>
          <Button onPress={(e)=>{
            const fomrdata=new FormData()
            fomrdata.append('username','adminGuest')
            fomrdata.append('password','adminGuest')
            fomrdata.append('email','guestAdminUser@gmail.com')
            authenticate(undefined,fomrdata)
            
          }}>Enter as Admin guest</Button>

    </Form>

    </main>
    
</>
}