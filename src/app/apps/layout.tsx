"use client";

import { useEffect, useRef } from "react";
import { getApplicationById } from "@/lib/applications";

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // イベントハンドラーとインターバルIDの参照を保持
  const handlersRef = useRef<{
    popstate?: (e: PopStateEvent) => void;
    keydown?: (e: KeyboardEvent) => void;
    beforeunload?: (e: BeforeUnloadEvent) => void;
    touchstart?: (e: TouchEvent) => void; // タッチイベント用
  }>({});
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  // 履歴操作の回数を制限するためのカウンター
  const pushStateCountRef = useRef<number>(0);
  const lastPushTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // クライアントサイドでのみ実行
    if (typeof window === 'undefined') return;

    // URLからアプリケーションIDを抽出
    const pathname = window.location.pathname;
    const appId = pathname.split("/apps/")[1]?.split("/")[0];

    if (!appId) return;

    try {
      // アプリケーション情報を取得
      const appInfo = getApplicationById(appId);
      
      // 戻るボタンが禁止されているかチェック
      if (appInfo?.preventNavigationBack) {
        console.log(`Back navigation is prevented for app: ${appId}`);
        
        // 現在のURLをセッションストレージに保存
        try {
          sessionStorage.setItem("lastVisitedPage", pathname);
        } catch (e) {
          console.warn("Failed to access sessionStorage:", e);
        }
        
        // 履歴スタックに状態を追加（戻るボタンを無効化）
        try {
          // 初期の履歴スタック追加は10回に制限
          for (let i = 0; i < 10; i++) {
            history.pushState({ noBackButton: true }, "", window.location.href);
          }
          pushStateCountRef.current = 10;
        } catch (e) {
          console.warn("Failed to manipulate history:", e);
        }
        
        // 戻るボタンが押された時の処理
        handlersRef.current.popstate = (e) => {
          try {
            e.preventDefault?.();
            // 安全に履歴を操作
            if (canPushState()) {
              history.pushState(null, "", window.location.href);
              pushStateCountRef.current++;
            }
            alert("戻る操作は禁止されています");
          } catch (err) {
            console.error("Error in popstate handler:", err);
          }
          return false;
        };
        
        // Alt+左矢印キーの処理
        handlersRef.current.keydown = (e: KeyboardEvent) => {
          try {
            // iPadやデスクトップでの戻るショートカットを検出
            if (
              (e.altKey && e.key === "ArrowLeft") || // Windows/Linux
              (e.ctrlKey && e.key === "ArrowLeft") || // Windows/Linux
              (e.metaKey && e.key === "[") || // Mac
              (e.metaKey && e.key === "ArrowLeft") // Mac
            ) {
              e.preventDefault();
              alert("戻る操作は禁止されています");
              return false;
            }
          } catch (err) {
            console.error("Error in keydown handler:", err);
          }
        };
        
        // タッチスワイプによる戻る操作の防止（iPadなど）
        if ('ontouchstart' in window) {
          try {
            let touchStartX = 0;
            handlersRef.current.touchstart = (e: TouchEvent) => {
              if (!e.touches || e.touches.length === 0) return;
              
              touchStartX = e.touches[0].screenX;
              
              const touchMoveHandler = (moveEvent: TouchEvent) => {
                try {
                  if (!moveEvent.touches || moveEvent.touches.length === 0) return;
                  
                  const touchEndX = moveEvent.touches[0].screenX;
                  // 右から左へのスワイプ（戻る操作）を検出
                  if (touchEndX - touchStartX > 50) {
                    moveEvent.preventDefault();
                    alert("戻る操作は禁止されています");
                  }
                } catch (err) {
                  console.error("Error in touchmove handler:", err);
                }
              };
              
              const touchEndHandler = () => {
                try {
                  document.removeEventListener('touchmove', touchMoveHandler);
                  document.removeEventListener('touchend', touchEndHandler);
                } catch (err) {
                  console.error("Error in touchend handler:", err);
                }
              };
              
              try {
                document.addEventListener('touchmove', touchMoveHandler, { passive: false });
                document.addEventListener('touchend', touchEndHandler);
              } catch (err) {
                console.error("Error adding touch event listeners:", err);
              }
            };
            
            // タッチイベントリスナーを追加
            document.addEventListener("touchstart", handlersRef.current.touchstart, { passive: false });
          } catch (err) {
            console.error("Error setting up touch handlers:", err);
          }
        }
        
        // ページを離れる前の処理
        handlersRef.current.beforeunload = (e: BeforeUnloadEvent) => {
          try {
            const message = "このページから離れると入力内容が失われる可能性があります。";
            e.returnValue = message;
            return message;
          } catch (err) {
            console.error("Error in beforeunload handler:", err);
            return undefined;
          }
        };
        
        // イベントリスナーを追加
        try {
          window.addEventListener("popstate", handlersRef.current.popstate);
          window.addEventListener("keydown", handlersRef.current.keydown);
          window.addEventListener("beforeunload", handlersRef.current.beforeunload);
        } catch (err) {
          console.error("Error adding event listeners:", err);
        }
        
        // 履歴操作の回数を制限するヘルパー関数
        const canPushState = () => {
          const now = Date.now();
          // 10秒経過したらカウンターをリセット
          if (now - lastPushTimeRef.current > 10000) {
            pushStateCountRef.current = 0;
            lastPushTimeRef.current = now;
            return true;
          }
          // 10秒以内に90回以上の操作があれば制限
          return pushStateCountRef.current < 90;
        };
        
        // 定期的に履歴スタックを更新して戻るボタンを無効化
        try {
          intervalIdRef.current = setInterval(() => {
            try {
              // 履歴操作の回数を制限
              if (canPushState()) {
                history.pushState({ noBackButton: true }, "", window.location.href);
                pushStateCountRef.current++;
              }
            } catch (e) {
              console.warn("Failed to update history in interval:", e);
            }
          }, 1000); // 1秒ごとに実行（セキュリティエラーを回避）
        } catch (err) {
          console.error("Error setting up interval:", err);
        }
      }
    } catch (error) {
      console.error("Error in back navigation prevention:", error);
    }
    
    // クリーンアップ関数
    return () => {
      try {
        // イベントリスナーを削除
        if (handlersRef.current.popstate) {
          window.removeEventListener("popstate", handlersRef.current.popstate);
        }
        if (handlersRef.current.keydown) {
          window.removeEventListener("keydown", handlersRef.current.keydown);
        }
        if (handlersRef.current.beforeunload) {
          window.removeEventListener("beforeunload", handlersRef.current.beforeunload);
        }
        if (handlersRef.current.touchstart) {
          document.removeEventListener("touchstart", handlersRef.current.touchstart);
        }
        
        // インターバルをクリア
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
        }
        
        // ハンドラー参照をリセット
        handlersRef.current = {};
      } catch (err) {
        console.error("Error in cleanup function:", err);
      }
    };
  }, []);

  return (
    <div className="h-full">
      {children}
    </div>
  );
}
