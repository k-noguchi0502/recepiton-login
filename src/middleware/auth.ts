import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { hasPermission, hasAnyPermission } from "@/lib/permissions";
import { Session } from "next-auth";

// ハンドラー関数の型定義
type ApiHandler = (
  req: NextRequest,
  session?: Session
) => Promise<NextResponse>;

/**
 * 認証が必要なAPIエンドポイント用のミドルウェア
 * @param handler APIハンドラ関数
 * @returns 認証済みの場合はハンドラの結果、そうでない場合は401エラー
 */
export function withAuth(handler: ApiHandler) {
  return async (
    req: NextRequest
  ) => {
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    return handler(req, session);
  };
}

/**
 * 特定の権限が必要なAPIエンドポイント用のミドルウェア
 * @param permission 必要な権限
 * @param handler APIハンドラ関数
 * @returns 権限がある場合はハンドラの結果、そうでない場合は403エラー
 */
export function withPermission(permission: string, handler: ApiHandler) {
  return withAuth(async (
    req: NextRequest,
    session?: Session
  ) => {
    if (!session || !hasPermission(session, permission)) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    return handler(req, session);
  });
}

/**
 * 複数の権限のいずれかが必要なAPIエンドポイント用のミドルウェア
 * @param permissions 必要な権限の配列
 * @param handler APIハンドラ関数
 * @returns いずれかの権限がある場合はハンドラの結果、そうでない場合は403エラー
 */
export function withAnyPermission(permissions: string[], handler: ApiHandler) {
  return withAuth(async (
    req: NextRequest,
    session?: Session
  ) => {
    if (!session || !hasAnyPermission(session, permissions)) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    return handler(req, session);
  });
}

/**
 * 管理者ロール用のミドルウェア
 * @param handler APIハンドラ関数
 * @returns 管理者の場合はハンドラの結果、そうでない場合は403エラー
 */
export function withAdmin(handler: ApiHandler) {
  return withAuth(async (
    req: NextRequest,
    session?: Session
  ) => {
    if (!session || !session.user.role || session.user.role.name !== "admin") {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }

    return handler(req, session);
  });
} 