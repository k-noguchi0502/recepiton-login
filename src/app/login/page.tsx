"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, SessionProvider } from "next-auth/react";
import Image from "next/image";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/LoginForm";

/**
 * ログインページコンポーネント
 * ユーザー認証のためのログインフォームを提供します
 */
function LoginPageContent() {
  const router = useRouter();
  const { status } = useSession();
  const [showContent, setShowContent] = useState(false);

  // 認証状態に基づいて表示を制御
  useEffect(() => {
    // 既に認証済みの場合はダッシュボードにリダイレクト
    if (status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      // 未認証の場合はコンテンツを表示
      setShowContent(true);
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* 認証状態チェック中はコンテンツを非表示にする */}
      {showContent ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full flex flex-col md:flex-row"
        >
          {/* 左側の画像セクション - 横向き（landscape）の時のみ表示 */}
          <div className="hidden landscape:md:block landscape:md:w-1/2 relative">
            <div className="absolute inset-0 bg-blue-600">
              <Image
                src="/images/placeholder.svg"
                alt="ログイン画像"
                fill
                style={{ objectFit: "cover", opacity: 0.8 }}
              />
            </div>
          </div>

          {/* 右側のログインフォーム - 縦向き（portrait）の時は全幅 */}
          <div className="flex flex-col justify-center items-center p-8 md:p-12 w-full landscape:md:w-1/2 bg-white">
            <div className="w-full max-w-md space-y-8">
              <div className="text-center">
                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">管理システム</h2>
              </div>
              
              <LoginForm 
                onSuccess={() => {
                  router.push("/dashboard");
                  router.refresh();
                }}
              />
            </div>
          </div>
        </motion.div>
      ) : (
        // 認証チェック中は中央にローディングを表示
        <div className="w-full h-screen flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">ログイン状態を確認中...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginPageContent />
    </SessionProvider>
  );
}