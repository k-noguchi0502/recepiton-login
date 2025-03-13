import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ロール一覧を取得
export async function GET() {
  try {
    const session = await auth();

    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 権限チェック
    if (!session.user.role || !session.user.role.permissions.includes("role:read")) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const roles = await prisma.role.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error("ロール取得エラー:", error);
    return NextResponse.json(
      { error: "ロールの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 新しいロールを作成
export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 権限チェック
    if (!session.user.role || !session.user.role.permissions.includes("role:create")) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, permissions } = body;

    if (!name) {
      return NextResponse.json(
        { error: "ロール名は必須です" },
        { status: 400 }
      );
    }

    // 既存のロールをチェック
    const existingRole = await prisma.role.findUnique({
      where: { name },
    });

    if (existingRole) {
      return NextResponse.json(
        { error: "このロール名は既に使用されています" },
        { status: 400 }
      );
    }

    // 新しいロールを作成
    const role = await prisma.role.create({
      data: {
        name,
        description,
        permissions: permissions || [],
      },
    });

    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    console.error("ロール作成エラー:", error);
    return NextResponse.json(
      { error: "ロールの作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
