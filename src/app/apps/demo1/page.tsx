"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getApplicationById } from "@/lib/applications";
import { useSession } from "next-auth/react";
import Image from "next/image";

// クライアントサイドのみの動作を明示
export default function Demo1Page() {
  const router = useRouter();
  const [preventBack, setPreventBack] = useState(false);
  const session = useSession();
  const { data: sessionData, status } = session || { data: null, status: "loading" };

  // アプリケーション設定を取得
  useEffect(() => {
    const appInfo = getApplicationById("demo1");
    if (appInfo) {
      setPreventBack(!!appInfo.preventNavigationBack);
    }
  }, []);

  // ダッシュボードに戻る処理
  const handleBackToDashboard = () => {
    // 戻るボタンが禁止されている場合はセッションストレージをクリア
    if (preventBack) {
      console.log("Clearing session storage before navigation");
      sessionStorage.removeItem("lastVisitedPage");
      // 履歴をクリア
      window.removeEventListener("popstate", () => {});
      window.removeEventListener("beforeunload", () => {});
    }
    
    router.push("/dashboard");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>サンプルページ 1</CardTitle>
          <CardDescription>
            これはシンプルなサンプルページです{preventBack ? '（戻る操作禁止）' : '（戻る操作可能）'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-2">サンプルコンテンツ</h3>
            <p>このページはシンプルなサンプルページです。</p>
            <p className="mt-2">戻るボタンの制御はlayout.tsxで行われています。</p>
            {preventBack ? (
              <p className="mt-2 text-red-500">このページでは戻るボタンの操作が禁止されています。</p>
            ) : (
              <p className="mt-2 text-green-500">このページでは戻るボタンの操作が可能です。</p>
            )}
          </div>
          
          <div className="p-4 border rounded-md mt-4">
            <h3 className="text-lg font-medium mb-2">ログインユーザー情報</h3>
            {status === "loading" ? (
              <p>ユーザー情報を読み込み中...</p>
            ) : status === "authenticated" && sessionData?.user ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">名前:</span>
                  <span>{sessionData.user.name || "未設定"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">メールアドレス:</span>
                  <span>{sessionData.user.email || "未設定"}</span>
                </div>
                {sessionData.user.image && (
                  <div className="mt-2">
                    <span className="font-semibold block mb-1">プロフィール画像:</span>
                    <Image 
                      src={sessionData.user.image} 
                      alt="プロフィール画像" 
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  </div>
                )}
                {sessionData.user.role && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">ロール:</span>
                    <span>{sessionData.user.role.name}</span>
                  </div>
                )}
                {sessionData.user.department && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">部署:</span>
                    <span>{sessionData.user.department.name}</span>
                  </div>
                )}
                {sessionData.user.company && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">会社:</span>
                    <span>{sessionData.user.company.name}</span>
                  </div>
                )}
              </div>
            ) : (
              <p>ログインしていません</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBackToDashboard}>
            ダッシュボードに戻る
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 