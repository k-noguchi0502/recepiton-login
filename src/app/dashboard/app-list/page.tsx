"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { filterApplicationsByPermissions } from "@/lib/applications";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { AppListSkeleton } from "@/components/SkeletonLoading";

/**
 * アプリケーション一覧ページコンポーネント
 * ユーザーがアクセス可能なアプリケーションの一覧を表示します
 */
export default function AppListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // 未認証の場合はログインページにリダイレクト
  useEffect(() => {
    if (status === "unauthenticated") {
      // 直接リダイレクトして履歴をリセット
      window.location.replace('/login');
    }
  }, [status]);

  // ローディング中の表示
  if (status === "loading") {
    return <AppListSkeleton />;
  }

  // ユーザーの権限に基づいてフィルタリングされたアプリケーション
  const filteredApps = filterApplicationsByPermissions(
    session?.user?.role?.permissions
  );

  // 検索語に基づいてアプリケーションをフィルタリング
  const searchFilteredApps = filteredApps.filter(
    (app) =>
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.tags &&
        app.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ))
  );

  // アプリケーションを開く処理
  const handleOpenApp = (appId: string) => {
    router.push(`/apps/${appId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
    >
      <div className="space-y-6">
        {/* ページヘッダー - ページタイトルは既にヘッダーコンポーネントに表示されているため省略 */}
        <div className="hidden">
          <h1 className="text-2xl font-bold text-gray-900">
            アプリケーション一覧
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            利用可能なアプリケーションの一覧です
          </p>
        </div>

        {/* 検索機能 */}
        <Card>
          <CardHeader>
            <CardTitle>アプリケーション検索</CardTitle>
            <CardDescription>名前、説明、タグで検索できます</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="アプリケーションを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
              autoFocus={false}
            />
          </CardContent>
        </Card>

        {/* アプリケーション一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>アプリケーション一覧</CardTitle>
            <CardDescription>
              あなたが利用できるアプリケーション一覧です
            </CardDescription>
          </CardHeader>
          <CardContent>
            {searchFilteredApps.length === 0 ? (
              <p className="text-gray-500 italic">
                {searchTerm
                  ? "検索条件に一致するアプリケーションがありません。"
                  : "アクセス可能なアプリケーションがありません。"}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchFilteredApps.map((app) => (
                  <Card
                    key={app.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{app.icon}</span>
                        <CardTitle>{app.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">{app.description}</p>
                      {app.tags && app.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {app.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleOpenApp(app.id)}
                      >
                        アプリを開く
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
