import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// ミドルウェアはクライアントサイドでも実行される可能性があるため、
// Prismaを使用するコードを避ける必要があります
export default auth((req) => {
  // 認証済みユーザーのみアクセス可能なパスを定義
  const protectedPaths = ["/dashboard", "/admin", "/profile"];
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );

  // 認証されていないユーザーがprotectedPathsにアクセスしようとした場合
  if (isProtectedPath && !req.auth) {
    return Response.redirect(new URL("/login", req.url));
  }

  // 認証済みユーザーがログインページにアクセスしようとした場合
  if (req.auth && req.nextUrl.pathname === "/login") {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // それ以外の場合は次のミドルウェアまたはルートハンドラに進む
  return NextResponse.next();
});

// 認証チェックを行うパスを指定
export const config = {
  matcher: [
    // 認証チェックを行うパス
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/login",
    // 認証APIルートとNext.jsの静的ファイル、問題のあるページは除外
    "/((?!api/auth|_next/static|_next/image|favicon.ico|manifest.webmanifest).*)",
  ],
};