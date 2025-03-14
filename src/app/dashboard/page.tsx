"use client";

import { useSession } from "next-auth/react";
import { UserInfoCard } from "@/components/UserInfoCard";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { DashboardSkeleton } from "@/components/SkeletonLoading";

/**
 * ダッシュボードページコンポーネント
 * ユーザー情報を表示します
 */
export default function DashboardPage() {
  const { data: session, status } = useSession();

  // ローディング中の表示
  if (status === "loading") {
    return <DashboardSkeleton />;
  }

  // 認証されていない場合は何も表示しない（レイアウトでリダイレクト処理を行う）
  if (status === "unauthenticated") {
    return null;
  }

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
      </div>
    </motion.div>
  );
}