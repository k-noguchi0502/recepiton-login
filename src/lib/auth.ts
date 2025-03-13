import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { Role } from "@/types";
import { compareSync } from "bcrypt-edge";

// ユーザー型の定義
interface UserWithRole {
  id: string;
  email: string;
  name: string;
  image?: string;
  role?: Role | null;
}

/**
 * NextAuth v5の設定
 * React 19とNext.js 15に対応
 */
export const { auth, signIn, signOut, handlers } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          },
          include: {
            role: true
          }
        });

        if (!user || !user.password) {
          return null;
        }

        // bcrypt-edgeを使用してパスワードを検証（同期メソッドを使用）
        const isPasswordValid = compareSync(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role
        };
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  secret: process.env.NEXTAUTH_SECRET,
  // 開発環境ではデバッグモードを有効化
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
        session.user.role = token.role as Role | null;
      }
      return session;
    },
    async jwt({ token, user, trigger }) {
      // ユーザーがログインした場合のみデータベースにアクセス
      if (user) {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.image,
          role: (user as UserWithRole).role
        };
      }

      // トークン更新の場合
      if (trigger === "update") {
        return { ...token };
      }

      // ミドルウェアでは、既存のトークンをそのまま返す
      return token;
    },
  },
});