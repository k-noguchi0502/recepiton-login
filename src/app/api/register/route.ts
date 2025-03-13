import { NextResponse } from "next/server";
import { hashSync } from "bcrypt-edge";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// 静的エクスポートのための設定
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, roleId } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "名前、メールアドレス、パスワードは必須です" },
        { status: 400 }
      );
    }

    // ロールIDが指定されている場合は、管理者権限が必要
    if (roleId) {
      const session = await auth();

      // 認証チェック
      if (!session) {
        return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
      }

      // 管理者権限チェック
      if (!session.user.role || session.user.role.name !== "admin") {
        return NextResponse.json(
          { error: "権限がありません" },
          { status: 403 }
        );
      }

      // ロールが存在するか確認
      const roleCount = await prisma.role.count({
        where: { id: roleId }
      });

      if (roleCount === 0) {
        return NextResponse.json(
          { error: "指定されたロールが存在しません" },
          { status: 400 }
        );
      }
    }

    // メールアドレスの重複チェック
    const existingUserCount = await prisma.user.count({
      where: { email }
    });

    if (existingUserCount > 0) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    const hashedPassword = hashSync(password, 10);

    // デフォルトロールの取得（roleIdが指定されていない場合）
    let finalRoleId = roleId;
    if (!roleId) {
      const defaultRole = await prisma.role.findFirst({
        where: { name: 'user' },
        select: { id: true }
      });

      if (defaultRole) {
        finalRoleId = defaultRole.id;
      }
    }

    // ユーザーを作成
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: finalRoleId
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    return NextResponse.json(
      { error: "ユーザー登録中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
