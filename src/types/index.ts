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
  createdAt?: string;
  updatedAt?: string;
}

// 会社の型定義
export interface Company {
  id: string;
  name: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

// 部署の型定義
export interface Department {
  id: string;
  name: string;
  description?: string | null;
  companyId: string;
  company?: Company;
  createdAt?: string;
  updatedAt?: string;
}

// ユーザーの型定義
export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  roleId?: string | null;
  role?: Role | null;
  companyId?: string | null;
  company?: Company | null;
  departmentId?: string | null;
  department?: Department | null;
  createdAt?: string;
  updatedAt?: string;
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

// ユーザーフォームデータの型定義
export interface UserFormData {
  id: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  companyId: string;
  departmentId: string;
}

// 会社フォームデータの型定義
export interface CompanyFormData {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

// 部署フォームデータの型定義
export interface DepartmentFormData {
  id: string;
  name: string;
  description: string;
  companyId: string;
}

// ロールフォームデータの型定義
export interface RoleFormData {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// 権限グループの型定義
export interface PermissionGroup {
  name: string;
  permissions: {
    id: string;
    label: string;
  }[];
} 