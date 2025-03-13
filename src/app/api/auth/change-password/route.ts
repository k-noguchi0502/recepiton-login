import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { compareSync, hashSync } from "bcrypt-edge";
import { prisma } from "@/lib/prisma";

/**
 * パスワード変更APIエンドポイント
 * ユーザーのパスワードを変更します
 */
export async function POST(req: NextRequest) {
  try {
    // セッションからユーザー情報を取得
    const session = await auth();

    // 未認証の場合はエラーを返す
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "認証されていません" },
        { status: 401 }
      );
    }

    // リクエストボディからパスワード情報を取得
    const { currentPassword, newPassword } = await req.json();

    // 必須パラメータのバリデーション
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "現在のパスワードと新しいパスワードは必須です" },
        { status: 400 }
      );
    }

    // パスワードの長さバリデーション
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: "新しいパスワードは8文字以上である必要があります" },
        { status: 400 }
      );
    }

    // ユーザー情報を取得
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id
      }
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // 現在のパスワードを検証
    const isPasswordValid = compareSync(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "現在のパスワードが正しくありません" },
        { status: 400 }
      );
    }

    // 新しいパスワードをハッシュ化
    const hashedPassword = hashSync(newPassword, 10);

    // パスワードを更新
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        password: hashedPassword
      }
    });

    // 成功レスポンスを返す
    return NextResponse.json(
      { message: "パスワードが正常に更新されました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("パスワード更新エラー:", error);
    return NextResponse.json(
      { message: "パスワードの更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
} 