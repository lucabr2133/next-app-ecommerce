import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { sql } from "@/supabase";

declare module "next-auth" {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role?: string;
    };
  }
}

export type User = {
  id: number;
  username: string;
  password: string;
  email?: string;
  role: "user" | "admin";
  is_active: boolean;
  img_url: string;
};

async function getUser(username: string): Promise<User | undefined> {
  try {
    const user = await sql<User[]>`SELECT * FROM users WHERE username=${username}`;

    return user[0];
  } catch (error) {
    console.error("Database Error in getUser:", error);
    throw new Error("Failed to fetch user.");
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string().min(1, "Username is required"),
            password: z.string().min(1, "Password is required"),
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);

          if (!user || user.is_active === false) return null;

          const isPasswordMatch = await bcrypt.compare(password, user.password);

          if (isPasswordMatch) {
            return {
              name: user.username,
              id: String(user.id),
              email: user.email,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
});

export { authConfig };

