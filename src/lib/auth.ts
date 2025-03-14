import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { Role } from "@/types";
import { compareSync } from "bcrypt-edge";

// ユーザー型の定義
interface UserWithRole {
  id: string;
  email: string | null;
  name: string | null;
  image?: string | null;
  role?: Role | null;
  company?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  department?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
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
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Prismaクライアントが利用可能かチェック
          if (!prisma || !prisma.user) {
            console.error("Prisma client is not available");
            throw new Error("Database connection error");
          }

          // メールアドレスでユーザーを検索
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              role: true,
              company: true,
              department: true,
            },
          });

          // ユーザーが存在しない場合
          if (!user || !user.password) {
            return null;
          }

          // パスワードの検証
          const isPasswordValid = compareSync(
            credentials.password,
            user.password
          );

          // パスワードが一致しない場合
          if (!isPasswordValid) {
            return null;
          }

          // 認証成功
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            company: user.company,
            department: user.department,
          } as UserWithRole;
        } catch (error) {
          console.error("認証エラー:", error);
          return null;
        }
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
      if (token.id) {
        session.user.id = token.id as string;
      }
      if (token.role) {
        session.user.role = token.role as Role;
      }
      if (token.company) {
        session.user.company = token.company as {
          id: string;
          name: string;
          description?: string | null;
        };
      }
      if (token.department) {
        session.user.department = token.department as {
          id: string;
          name: string;
          description?: string | null;
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      // ミドルウェアで実行されている場合はPrismaを使用しない
      // typeof windowがundefinedの場合はサーバーサイド、それ以外はクライアントサイド
      if (typeof token.id === 'string' && typeof window === 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
        try {
          const userData = await prisma.user.findUnique({
            where: { id: token.id },
            include: {
              role: true,
              company: true,
              department: true,
            },
          });

          if (userData && userData.role) {
            token.role = userData.role;
          }
          
          if (userData && userData.company) {
            token.company = userData.company;
          }
          
          if (userData && userData.department) {
            token.department = userData.department;
          }
        } catch (error) {
          console.error("JWTコールバックでのPrismaエラー:", error);
          // エラーが発生しても処理を続行
        }
      }

      return token;
    },
  },
});