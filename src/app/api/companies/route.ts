import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

// 静的エクスポートのための設定
export const dynamic = 'force-dynamic';

/**
 * 会社一覧を取得するAPI
 * @returns 会社一覧
 */
export async function GET() {
  try {
    // 認証チェック
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }

    // 会社一覧を取得
    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        website: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(companies);
  } catch (error) {
    console.error("会社一覧取得エラー:", error);
    return NextResponse.json(
      { error: "会社一覧の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * 新規会社を作成するAPI
 * @param request リクエスト
 * @returns 作成された会社
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }

    // 権限チェック
    if (!hasPermission(session, "company:create")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // リクエストボディを取得
    const body = await request.json();
    const { name, description, address, phone, email, website } = body;

    // バリデーション
    if (!name) {
      return NextResponse.json(
        { error: "会社名は必須です" },
        { status: 400 }
      );
    }

    // 会社名の重複チェック
    const existingCompany = await prisma.company.findUnique({
      where: { name },
    });

    if (existingCompany) {
      return NextResponse.json(
        { error: "この会社名は既に使用されています" },
        { status: 400 }
      );
    }

    // 会社を作成
    const company = await prisma.company.create({
      data: {
        name,
        description,
        address,
        phone,
        email,
        website,
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error) {
    console.error("会社作成エラー:", error);
    return NextResponse.json(
      { error: "会社の作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 