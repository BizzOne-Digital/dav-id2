import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/lib/constants/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
    };
  }
  interface User {
    role: Role;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: Role;
    id?: string;
  }
}

/** Edge-safe auth config (no MongoDB / bcrypt). Used by middleware. */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as Role) || "customer";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
