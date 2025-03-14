import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { hasPermission } from "@/lib/permissions";

// 静的エクスポートのための設定
export const dynamic = 'force-dynamic';

/**
 * ユーザー一覧を取得するAPI
 * @returns ユーザー一覧
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
    if (!hasPermission(session, "user:read")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // ユーザー一覧を取得
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        companyId: true,
        departmentId: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("ユーザー一覧取得エラー:", error);
    return NextResponse.json(
      { error: "ユーザー一覧の取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// 新規ユーザーを作成
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
    if (!hasPermission(session, "user:create")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // リクエストボディを取得
    const body = await request.json();
    const { name, email, password, roleId, companyId, departmentId } = body;

    // バリデーション
    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { error: "必須項目が不足しています" },
        { status: 400 }
      );
    }

    // メールアドレスの重複チェック
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "このメールアドレスは既に使用されています" },
        { status: 400 }
      );
    }

    // ロールの存在チェック
    const role = await prisma.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return NextResponse.json(
        { error: "指定されたロールが存在しません" },
        { status: 400 }
      );
    }

    // 会社の存在チェック（指定されている場合）
    if (companyId) {
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });

      if (!company) {
        return NextResponse.json(
          { error: "指定された会社が存在しません" },
          { status: 400 }
        );
      }
    }

    // 部署の存在チェック（指定されている場合）
    if (departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });

      if (!department) {
        return NextResponse.json(
          { error: "指定された部署が存在しません" },
          { status: 400 }
        );
      }

      // 部署が指定されている場合は会社も指定されているか確認
      if (!companyId) {
        return NextResponse.json(
          { error: "部署を指定する場合は会社も指定してください" },
          { status: 400 }
        );
      }

      // 部署が指定された会社に属しているか確認
      if (department.companyId !== companyId) {
        return NextResponse.json(
          { error: "指定された部署は指定された会社に属していません" },
          { status: 400 }
        );
      }
    }

    // パスワードのハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
        companyId,
        departmentId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        companyId: true,
        departmentId: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
        department: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("ユーザー作成エラー:", error);
    return NextResponse.json(
      { error: "ユーザーの作成中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 