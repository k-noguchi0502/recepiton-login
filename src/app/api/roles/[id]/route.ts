import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

// ロール詳細の取得
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 権限チェック
    if (!hasPermission(session, "role:read")) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const role = await prisma.role.findUnique({
      where: { id: params.id },
    });

    if (!role) {
      return NextResponse.json(
        { error: "ロールが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("ロール取得エラー:", error);
    return NextResponse.json(
      { error: "ロールの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// ロールの更新
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 権限チェック
    if (!hasPermission(session, "role:update")) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    const body = await req.json();
    const { name, description, permissions } = body;

    // ロールの存在確認
    const existingRole = await prisma.role.findUnique({
      where: { id: params.id },
    });

    if (!existingRole) {
      return NextResponse.json(
        { error: "ロールが見つかりません" },
        { status: 404 }
      );
    }

    // 名前が変更される場合、重複チェック
    if (name && name !== existingRole.name) {
      const duplicateName = await prisma.role.findUnique({
        where: { name },
      });

      if (duplicateName) {
        return NextResponse.json(
          { error: "このロール名は既に使用されています" },
          { status: 400 }
        );
      }
    }

    // ロールを更新
    const updatedRole = await prisma.role.update({
      where: { id: params.id },
      data: {
        name: name || existingRole.name,
        description:
          description !== undefined ? description : existingRole.description,
        permissions: permissions || existingRole.permissions,
      },
    });

    return NextResponse.json(updatedRole);
  } catch (error) {
    console.error("ロール更新エラー:", error);
    return NextResponse.json(
      { error: "ロールの更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// ロールの削除
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    // 認証チェック
    if (!session) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 権限チェック
    if (!hasPermission(session, "role:delete")) {
      return NextResponse.json({ error: "権限がありません" }, { status: 403 });
    }

    // ロールの存在確認
    const role = await prisma.role.findUnique({
      where: { id: params.id },
      include: {
        users: {
          select: { id: true },
          take: 1,
        },
      },
    });

    if (!role) {
      return NextResponse.json(
        { error: "ロールが見つかりません" },
        { status: 404 }
      );
    }

    // ロールが使用中かチェック
    if (role.users.length > 0) {
      return NextResponse.json(
        { error: "このロールは使用中のため削除できません" },
        { status: 400 }
      );
    }

    // ロールを削除
    await prisma.role.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "ロールが正常に削除されました" });
  } catch (error) {
    console.error("ロール削除エラー:", error);
    return NextResponse.json(
      { error: "ロールの削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
