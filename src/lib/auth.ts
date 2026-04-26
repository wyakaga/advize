import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || account.provider !== "google" || !profile?.email) {
        return false;
      }

      const googleId = account.providerAccountId;

      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/user-sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            googleId,
            email: profile.email,
            name: user.name ?? null,
            avatar: user.image ?? null,
          }),
        });
        return true;
      } catch {
        console.error("Failed to sync user on sign in");
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          const response = await fetch(`${process.env.NEXTAUTH_URL}/api/user?googleId=${token.sub}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });

          if (response.ok) {
            const data = await response.json();
            (session.user as any).id = data.user.id;
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
        }
      }
      return session;
    },
  

    async jwt({ token, account }) {
      if (account) {
        token.sub = account.providerAccountId;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  logger: {
    error(code, ...message) {
      console.error(code, message);
    },
    warn(code, ...message) {
      console.warn(code, message);
    },
    debug(code, ...message) {
      console.log(code, message);
    },
  },
});