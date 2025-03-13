"use client";

interface PreventNavigationProps {
  preventBack: boolean;
}

/**
 * ブラウザの戻るボタンによるナビゲーションを防止するコンポーネント
 * preventBack が true の場合、ブラウザの履歴操作を監視し、戻る操作を防止します
 * 
 * 注: 現在この機能は無効化されています。すべてのページで戻るボタンが使用可能です。
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PreventNavigation(_props: PreventNavigationProps) {
  // 機能を完全に無効化
  return null;
}
