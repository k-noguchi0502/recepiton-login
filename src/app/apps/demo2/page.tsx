"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getApplicationById } from "@/lib/applications";

// クライアントサイドのみの動作を明示
export default function Demo2Page() {
  const router = useRouter();
  const [preventBack, setPreventBack] = useState(false);

  // アプリケーション設定を取得
  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;

    try {
      const appInfo = getApplicationById("demo2");
      if (appInfo) {
        setPreventBack(!!appInfo.preventNavigationBack);
      }
    } catch (error) {
      console.error("Error getting application info:", error);
    }
  }, []);

  // ダッシュボードに戻る処理
  const handleBackToDashboard = () => {
    if (preventBack && typeof window !== 'undefined') {
      // 直接ダッシュボードに遷移
      window.location.href = "/dashboard";
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>サンプルページ 2</CardTitle>
          <CardDescription>
            これはシンプルなサンプルページです{preventBack ? '（戻る操作禁止）' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-md">
            <h3 className="text-lg font-medium mb-2">サンプルコンテンツ</h3>
            <p>このページはシンプルなサンプルページです。</p>
            <p className="mt-2">戻るボタンの制御はlayout.tsxで行われています。</p>
            {preventBack && (
              <>
                <p className="mt-2 text-red-500">このページでは戻るボタンの操作が禁止されています。</p>
                <p className="mt-2">ブラウザの戻るボタン、キーボードショートカット（Alt+←）、その他の戻る操作が無効化されています。</p>
              </>
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