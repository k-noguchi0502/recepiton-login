"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession, SessionProvider } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

// パスに基づいてページタイトルを取得する関数
function getPageTitle(pathname: string): string {
  const path = pathname.split('/').filter(Boolean);
  
  // ダッシュボードのルートページ
  if (path.length === 1 && path[0] === 'dashboard') {
    return 'ダッシュボード';
  }
  
  // サブページのタイトル
  if (path.length > 1 && path[0] === 'dashboard') {
    switch (path[1]) {
      case 'users':
        return 'ユーザー管理';
      case 'roles':
        return 'ロール管理';
      case 'app-list':
        return 'アプリ一覧';
      case 'account':
        return 'アカウント設定';
      default:
        return path[1].charAt(0).toUpperCase() + path[1].slice(1);
    }
  }
  
  return '管理システム';
}

function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const pageTitle = getPageTitle(pathname);
  const { status } = useSession();
  
  // 認証状態をチェック
  useEffect(() => {
    // セッションがない場合は即座にログインページにリダイレクト
    if (status === "unauthenticated") {
      router.replace('/login');
    }
  }, [status, router]);
  
  // 認証チェック中はローディング画面を表示
  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }
  
  // 未認証の場合は何も表示せずリダイレクト
  if (status === "unauthenticated") {
    return null;
  }
  
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar className="h-screen" />
        <div className="flex flex-col flex-1">
          <Header className="border-b z-50 h-[47px]" pageTitle={pageTitle} />
          <main className="flex-1 overflow-auto">
            <div className="h-full py-6 px-4 md:px-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SessionProvider>
  );
}