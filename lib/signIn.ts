"use server";

import { sql } from "@/supabase";
import bcrypt from "bcryptjs";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export async function signIn(prevState: any, formData: FormData) {
  const values = {
    email: formData.get("email") as string,
    username: formData.get("username") as string,
    password: formData.get("password") as string,
  };

  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
      message: "Please fix the errors below.",
    };
  }

  try {
    const hash = await bcrypt.hash(parsed.data.password, 10);
    await sql`
      INSERT INTO users (email, username, password,role)
      VALUES (${parsed.data.email}, ${parsed.data.username}, ${hash},'user')
    `;
    return {
      success: true,
      errors: {},
      message: "✅ User created successfully!",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      errors: {},
      message: "Something went wrong creating the user.",
    };
  }
}
