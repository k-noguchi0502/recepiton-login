import { Application } from "@/types";

// アプリケーション一覧
export const applications: Application[] = [
  {
    id: "demo1",
    name: "デモ1アプリケーション",
    description: "デモ1アプリケーションの説明文をここに記載します。シンプルなUIと基本機能を備えたデモアプリです。",
    icon: "🚀",
    permission: "page:demo1",
    category: "デモ",
    tags: ["基本", "シンプル"],
    preventNavigationBack: false,
    isActive: true,
  },
  {
    id: "demo2",
    name: "デモ2アプリケーション",
    description: "デモ2アプリケーションの説明文をここに記載します。タブインターフェースを使った高度なデモアプリです。",
    icon: "⚙️",
    permission: "page:demo2",
    category: "デモ",
    tags: ["高度", "タブ"],
    preventNavigationBack: true,
    isActive: true,
  },
];

/**
 * ユーザーの権限に基づいてアプリケーションをフィルタリングする関数
 * @param permissions ユーザーが持つ権限の配列
 * @returns フィルタリングされたアプリケーションの配列
 */
export function filterApplicationsByPermissions(
  permissions: string[] | undefined
): Application[] {
  if (!permissions || permissions.length === 0) {
    return [];
  }
  return applications.filter(app => 
    app.isActive && permissions.includes(app.permission)
  );
}

/**
 * アプリケーションIDから特定のアプリケーション情報を取得する関数
 * @param appId アプリケーションID
 * @returns アプリケーション情報、見つからない場合はundefined
 */
export function getApplicationById(appId: string): Application | undefined {
  return applications.find(app => app.id === appId && app.isActive);
}

/**
 * ユーザーが特定のアプリケーションにアクセスできるかチェックする関数
 * @param appId アプリケーションID
 * @param permissions ユーザーの権限
 * @returns アクセス可能かどうか
 */
export function canAccessApplication(
  appId: string,
  permissions: string[] | undefined
): boolean {
  const app = getApplicationById(appId);
  
  if (!app || !app.isActive) {
    console.log(`App ${appId} not found or not active`);
    return false;
  }
  
  // 権限チェック
  const hasPermission = permissions?.includes(app.permission) || false;
  
  console.log(`App ${appId} - Permission: ${hasPermission}`);
  
  // 開発環境では権限チェックを緩和（任意の条件で）
  if (process.env.NODE_ENV === 'development') {
    return true; // 開発環境では常にアクセス可能
  }
  
  // 本番環境では権限チェックを行う
  return hasPermission;
}