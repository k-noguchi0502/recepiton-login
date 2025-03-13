"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
  pageTitle?: string;
}

/**
 * ヘッダーコンポーネント
 * アプリケーションのトップバーを提供し、ユーザープロフィールメニューを含みます
 */
export function Header({ children, className, pageTitle }: HeaderProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  /**
   * ログアウト処理を行う
   */
  const handleSignOut = async () => {
    // ログアウト前にローディングオーバーレイを表示
    const loadingOverlay = document.createElement("div");
    loadingOverlay.className =
      "fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50";
    loadingOverlay.innerHTML = `
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-600">ログアウト中...</p>
      </div>
    `;
    document.body.appendChild(loadingOverlay);

    try {
      // ログアウト処理
      await signOut({ redirect: false });

      // セッションクッキーを手動で削除
      document.cookie.split(";").forEach((cookie) => {
        const [name] = cookie.trim().split("=");
        if (name.includes("next-auth") || name.includes("__Secure-next-auth")) {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; secure; samesite=lax`;
        }
      });

      // ログイン画面に直接遷移（履歴をリセット）
      window.location.replace("/login");
    } catch (error) {
      console.error("ログアウトエラー:", error);
      // エラーが発生した場合はオーバーレイを削除
      document.body.removeChild(loadingOverlay);
    }
  };

  /**
   * プロフィールメニューの表示/非表示を切り替える
   */
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  /**
   * アカウント設定ページに移動する
   */
  const navigateToAccount = () => {
    setIsProfileMenuOpen(false);
    router.push("/dashboard/account");
  };

  /**
   * メニュー外のクリックを検出して閉じる
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        isProfileMenuOpen
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-[47px] items-center border-b bg-background px-4 sm:px-6",
        className
      )}
    >
      <div className="flex flex-1 items-center justify-between">
        {/* 左側のコンテンツ */}
        <div className="flex items-center gap-3">
          {children}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-lg font-bold">
              {pageTitle || "管理システム"}
            </span>
          </div>
          <span className="text-base font-semibold md:hidden">
            {pageTitle || "管理システム"}
          </span>
        </div>

        {/* 右側のユーザープロフィール */}
        <div className="flex items-center gap-4">
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={toggleProfileMenu}
              className="flex items-center gap-2 rounded-full border border-input bg-background p-1 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {/* ユーザーアバター */}
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                {session?.user?.name
                  ? session.user.name.charAt(0).toUpperCase()
                  : "U"}
              </div>

              {/* ユーザー名（モバイルでは非表示） */}
              <span className="hidden text-xs font-medium md:inline-block">
                {session?.user?.name || "ユーザー"}
              </span>

              {/* ドロップダウン矢印 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3 text-muted-foreground"
              >
                <path d="m6 9 6 6 6-6"></path>
              </svg>
            </button>

            {/* プロフィールドロップダウンメニュー */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 origin-top-right rounded-md bg-card border shadow-lg focus:outline-none">
                <div className="py-1">
                  {/* ユーザー情報 */}
                  <div className="px-3 py-1.5 text-xs border-b">
                    <div className="font-medium">
                      {session?.user?.name || "ユーザー"}
                    </div>
                    <div className="text-muted-foreground truncate">
                      {session?.user?.email || ""}
                    </div>
                  </div>

                  {/* アカウント設定リンク */}
                  <button
                    onClick={navigateToAccount}
                    className="block w-full px-3 py-1.5 text-left text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    アカウント設定
                  </button>

                  {/* ログアウトボタン */}
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-3 py-1.5 text-left text-xs hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
