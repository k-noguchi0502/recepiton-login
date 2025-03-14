import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// 静的エクスポートのための設定
export const dynamic = 'force-dynamic';

/**
 * 特定の部署を取得するAPI
 * @param request リクエスト
 * @param context コンテキスト
 * @returns 部署情報
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

    // 部署を取得
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "指定された部署が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(department);
  } catch (error) {
    console.error("部署取得エラー:", error);
    return NextResponse.json(
      { error: "部署の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * 部署を更新するAPI
 * @param request リクエスト
 * @param context コンテキスト
 * @returns 更新された部署情報
 */
export async function PUT(
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
    if (!session.user.role?.permissions.includes("department:update")) {
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

    // 部署の存在確認
    const existingDepartment = await prisma.department.findUnique({
      where: {
        id,
      },
    });

    if (!existingDepartment) {
      return NextResponse.json(
        { error: "指定された部署が見つかりません" },
        { status: 404 }
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
    const duplicateDepartment = await prisma.department.findFirst({
      where: {
        name,
        companyId,
        id: {
          not: id,
        },
      },
    });

    if (duplicateDepartment) {
      return NextResponse.json(
        { error: "同じ会社内に同名の部署が既に存在します" },
        { status: 400 }
      );
    }

    // 部署を更新
    const updatedDepartment = await prisma.department.update({
      where: {
        id,
      },
      data: {
        name,
        description,
        companyId,
      },
    });

    return NextResponse.json(updatedDepartment);
  } catch (error) {
    console.error("部署更新エラー:", error);
    return NextResponse.json(
      { error: "部署の更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * 部署を削除するAPI
 * @param request リクエスト
 * @param context コンテキスト
 * @returns 削除結果
 */
export async function DELETE(
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
    if (!session.user.role?.permissions.includes("department:delete")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // 部署の存在確認
    const department = await prisma.department.findUnique({
      where: {
        id,
      },
    });

    if (!department) {
      return NextResponse.json(
        { error: "指定された部署が見つかりません" },
        { status: 404 }
      );
    }

    // 部署を削除
    await prisma.department.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("部署削除エラー:", error);
    return NextResponse.json(
      { error: "部署の削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 