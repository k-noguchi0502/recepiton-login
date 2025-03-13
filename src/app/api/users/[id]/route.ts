import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission } from "@/lib/permissions";

// 特定のユーザーを取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // ユーザーを取得
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        roleId: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("ユーザー取得エラー:", error);
    return NextResponse.json(
      { error: "ユーザーの取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// ユーザー情報を更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    if (!hasPermission(session, "user:update")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // リクエストボディを取得
    const body = await request.json();
    const { name, email, roleId } = body;

    // ユーザーの存在確認
    const existingUser = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // メールアドレスの重複チェック（自分自身は除く）
    if (email && email !== existingUser.email) {
      const duplicateEmail = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (duplicateEmail) {
        return NextResponse.json(
          { error: "このメールアドレスは既に使用されています" },
          { status: 400 }
        );
      }
    }

    // ロールの存在確認（指定されている場合）
    if (roleId) {
      const role = await prisma.role.findUnique({
        where: {
          id: roleId,
        },
      });

      if (!role) {
        return NextResponse.json(
          { error: "指定されたロールが存在しません" },
          { status: 400 }
        );
      }
    }

    // ユーザー情報を更新
    const updatedUser = await prisma.user.update({
      where: {
        id: params.id,
      },
      data: {
        name: name !== undefined ? name : existingUser.name,
        email: email !== undefined ? email : existingUser.email,
        roleId: roleId !== undefined ? roleId : existingUser.roleId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        roleId: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("ユーザー更新エラー:", error);
    return NextResponse.json(
      { error: "ユーザーの更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

// ユーザーを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    if (!hasPermission(session, "user:delete")) {
      return NextResponse.json(
        { error: "権限がありません" },
        { status: 403 }
      );
    }

    // ユーザーの存在確認
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // 自分自身を削除しようとしていないか確認
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: "自分自身を削除することはできません" },
        { status: 400 }
      );
    }

    // ユーザーを削除
    await prisma.user.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "ユーザーが正常に削除されました" }
    );
  } catch (error) {
    console.error("ユーザー削除エラー:", error);
    return NextResponse.json(
      { error: "ユーザーの削除中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 