import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 静的エクスポートのための設定
export const dynamic = 'force-dynamic';

/**
 * 特定の会社に属する部署一覧を取得するAPI
 * @param request リクエスト
 * @param params パラメータ
 * @returns 部署一覧
 */
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // paramsを取得
    const { id } = context.params;

    // 認証チェック
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }

    // 権限チェック
    if (!session.user.role?.permissions.includes("department:read")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // 会社の存在確認
    const company = await prisma.company.findUnique({
      where: {
        id,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "指定された会社が見つかりません" },
        { status: 404 }
      );
    }

    // 部署一覧を取得
    const departments = await prisma.department.findMany({
      where: {
        companyId: id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        companyId: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error("部署一覧取得エラー:", error);
    return NextResponse.json(
      { error: "部署一覧の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 