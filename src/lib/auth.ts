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
        await prisma.user.upsert({
          where: { googleId },
          update: {
            name: user.name ?? undefined,
            avatar: user.image ?? undefined,
            email: profile.email,
          },
          create: {
            email: profile.email,
            name: user.name ?? null,
            avatar: user.image ?? null,
            googleId,
          },
        });
        return true;
      } catch (error) {
        console.error("Failed to sync user on sign in:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { googleId: token.sub },
          });

          if (dbUser) {
            (session.user as any).id = dbUser.id;
          }
        } catch (error) {
          console.error("Failed to fetch user for session:", error);
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