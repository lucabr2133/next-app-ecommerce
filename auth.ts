import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials';
 import {z} from 'zod'
 import { sql } from '@/supabase';
export type User = {
  id: number;
  username: string;
  password: string;
  email?: string; // opcional
  role:'user'|'admin',
  is_active:boolean,
  img_url:string
};
 async function getUser(username: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE username=${username}`;
    return user[0];
  } catch (error) {
    throw new Error('Failed to fetch user.');
  }
}
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [Credentials({
    async authorize(credentials){
      
        const parsedCredentials=z.object({username:z.string({
          error:'username is required'
        }),password:z.string(
          {error:'password is required'}
        )}).safeParse(credentials)
        if (parsedCredentials.success) {
          
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);
          
          
          if (!user) return null;
          const isPasswordMatch=await bcrypt.compare(password,user.password)
         if(isPasswordMatch) return {
          name:user.username,
          id:user.id,
          email:user.email,
          role:user.role
         
         }
        }
        console.log('Invalid credentials');
        return null;
    }
  })],
});

export { authConfig };
