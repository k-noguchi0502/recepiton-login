"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserInfoCard } from "@/components/UserInfoCard";
import { filterApplicationsByPermissions } from "@/lib/applications";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/components/SkeletonLoading";

/**
 * ダッシュボードページコンポーネント
 * ユーザー情報とアクセス可能なアプリケーションを表示します
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ローディング中の表示
  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  // 認証されていない場合は何も表示しない（レイアウトでリダイレクト処理を行う）
  if (status === "unauthenticated") {
    return null;
  }

  // ユーザーの権限に基づいてフィルタリングされたアプリケーション
  const filteredApps = filterApplicationsByPermissions(session?.user?.role?.permissions);

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
        ease: "easeOut"
      }}
    >
      <div className="space-y-6">
        {/* ページヘッダー - ページタイトルは既にヘッダーコンポーネントに表示されているため省略 */}
        <div className="hidden">
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="mt-1 text-sm text-gray-500">
            ようこそ、{session?.user.name}さん
          </p>
        </div>

        {/* ユーザー情報 */}
        <Card>
          <CardHeader>
            <CardTitle>ユーザー情報</CardTitle>
            <CardDescription>
              ようこそ、{session?.user.name}さん
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserInfoCard user={session?.user} />
          </CardContent>
        </Card>

        {/* アプリケーション一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>アクセス可能なアプリケーション</CardTitle>
            <CardDescription>
              あなたが利用できるアプリケーション一覧です
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredApps.length === 0 ? (
              <p className="text-gray-500 italic">アクセス可能なアプリケーションがありません。</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApps.map((app) => (
                  <Card key={app.id} className="hover:shadow-md transition-shadow">
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
                            <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
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