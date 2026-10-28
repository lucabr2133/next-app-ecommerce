import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.name;
        token.email = user.email;
        token.role = (user as { role?: string }).role;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.username as string;
        session.user.email = token.email as string;
        (session.user as { role?: string }).role = token.role as string;
      }

      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLogged = !!auth?.user;
      const role = (auth?.user as { role?: string } | undefined)?.role;
      const path = nextUrl.pathname;

      if (path.startsWith("/dashboard")) {
        if (!isLogged) return false;
        if (role !== "admin") {
          return Response.redirect(new URL("/", nextUrl));
        }

        return true;
      }

      if (path.startsWith("/profile") || path.startsWith("/checkout")) {
        return isLogged;
      }

      if (isLogged && (path === "/login" || path === "/sign")) {
        return Response.redirect(new URL("/", nextUrl));
      }

      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
