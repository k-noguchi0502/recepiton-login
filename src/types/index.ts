/**
 * 共通の型定義ファイル
 * アプリケーション全体で使用される型を定義します
 */

// ユーザーロールの型定義
export interface Role {
  id: string;
  name: string;
  description?: string | null;
  permissions: string[];
}

// ユーザーの型定義
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: Role | null;
}

// アプリケーションの型定義
export interface Application {
  id: string;
  name: string;
  description: string;
  icon: string;
  permission: string;
  category?: string;
  tags?: string[];
  /** 戻るボタン制御 */
  preventNavigationBack?: boolean;
  isActive?: boolean;
}

// ナビゲーション項目の型定義
export interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  requiredPermissions?: string[];
}

// フォームデータの型定義
export interface LoginFormData {
  email: string;
  password: string;
} 