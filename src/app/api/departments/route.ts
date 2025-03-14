import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 静的エクスポートのための設定
export const dynamic = 'force-dynamic';

/**
 * すべての部署一覧を取得するAPI
 * @returns 部署一覧
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

    // 権限チェック
    if (!session.user.role?.permissions.includes("department:read")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // 部署一覧を取得
    const departments = await prisma.department.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        companyId: true,
        createdAt: true,
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(departments);
  } catch (error) {
    // より詳細なエラーログ
    console.error("部署一覧取得エラー:", {
      message: error instanceof Error ? error.message : "不明なエラー",
      stack: error instanceof Error ? error.stack : undefined,
      error
    });
    
    // エラーの種類に応じたメッセージ
    let errorMessage = "部署一覧の取得中にエラーが発生しました";
    
    if (error instanceof Error) {
      if (error.message.includes("database") || error.message.includes("connection")) {
        errorMessage = "データベース接続エラーが発生しました。しばらく経ってからお試しください。";
      } else if (error.message.includes("timeout")) {
        errorMessage = "サーバーからの応答がタイムアウトしました。しばらく経ってからお試しください。";
      } else if (error.message.includes("prisma")) {
        errorMessage = "データ取得中にエラーが発生しました。システム管理者にお問い合わせください。";
      }
    }
    
    return NextResponse.json(
      { error: errorMessage, details: error instanceof Error ? error.message : undefined },
      { status: 500 }
    );
  }
}

/**
 * 部署を作成するAPI
 * @param request リクエスト
 * @returns 作成された部署情報
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
    if (!session.user.role?.permissions.includes("department:create")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description, companyId } = body;

    // 入力チェック
    if (!name) {
      return NextResponse.json(
        { error: "部署名は必須です" },
        { status: 400 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { error: "会社IDは必須です" },
        { status: 400 }
      );
    }

    // 会社の存在確認
    const company = await prisma.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "指定された会社が見つかりません" },
        { status: 404 }
      );
    }

    // 部署名の重複チェック（同じ会社内で）
    const existingDepartment = await prisma.department.findFirst({
      where: {
        name,
        companyId,
      },
    });

    if (existingDepartment) {
      return NextResponse.json(
        { error: "同じ会社内に同名の部署が既に存在します" },
        { status: 400 }
      );
    }

    // 部署を作成
    const department = await prisma.department.create({
      data: {
        name,
        description,
        companyId,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error("部署作成エラー:", error);
    return NextResponse.json(
      { error: "部署の作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 