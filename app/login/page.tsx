"use client"
import { Button, Form, Input } from "@heroui/react";

import { useSearchParams } from "next/navigation";
import { authenticate } from "@/services/authenticate";

export  default function LoginPage(){
     const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

return <>
    <main className="h-screen flex items-center justify-center">
        <Form className="min-w-1/4 flex  gap-5 border-1 p-12 rounded-2xl " action={authenticate}>
        <h2 className="text-center">Log in</h2>
        <Input placeholder="username" name="username" label='type your user'></Input>
        <Input placeholder="password" name="password" label='type your password'></Input>
          <input type="hidden" name="redirectTo" value={callbackUrl} />
        <Button type="submit" color="primary">Send</Button>
    </Form>

    </main>
    
</>
}