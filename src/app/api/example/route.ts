import { NextRequest, NextResponse } from "next/server";
import { withAuth, withPermission, withAnyPermission } from "@/middleware/auth";
import { Session } from "next-auth";

// 認証のみが必要なエンドポイント
export const GET = withAuth(async (req: NextRequest, session?: Session) => {
  if (!session) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  return NextResponse.json({
    message: "認証済みユーザー向けのデータ",
    user: session.user,
  });
});

// 特定の権限が必要なエンドポイント
export const POST = withPermission(
  "user:create",
  async (req: NextRequest, session?: Session) => {
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await req.json();

    // ここでユーザー作成のロジックを実装

    return NextResponse.json(
      {
        message: "ユーザーが作成されました",
        data: body,
      },
      { status: 201 }
    );
  }
);

// 複数の権限のいずれかが必要なエンドポイント
export const PUT = withAnyPermission(
  ["user:update", "role:update"],
  async (req: NextRequest, session?: Session) => {
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const body = await req.json();

    // ここで更新ロジックを実装

    return NextResponse.json({
      message: "データが更新されました",
      data: body,
    });
  }
);
