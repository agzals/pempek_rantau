import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, User, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./connect";

declare module "next-auth" {
  interface Session {
    user: User & {
      isAdmin: boolean; // perbaiki penulisan 'boolean'
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    isAdmin: boolean; // perbaiki penulisan 'boolean'
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.isAdmin = token.isAdmin;
      }
      return session;
    },
    async jwt({ token }) {
      if (token && token.email) {
        // periksa token dan properti email
        const userInDb = await prisma.user.findUnique({
          where: {
            email: token.email,
          },
        });
        if (userInDb) {
          // periksa apakah userInDb tidak null
          token.isAdmin = userInDb.isAdmin;
        }
      }
      return token || {}; // kembalikan token atau objek kosong jika tidak ada token
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
