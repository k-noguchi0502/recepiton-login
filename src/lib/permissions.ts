import { Session } from "next-auth";

/**
 * ユーザーが特定の権限を持っているかチェックする
 * @param session ユーザーセッション
 * @param permission 必要な権限
 * @returns 権限を持っている場合はtrue、そうでない場合はfalse
 */
export function hasPermission(session: Session | null, permission: string): boolean {
  if (!session || !session.user || !session.user.role) {
    return false;
  }
  
  return session.user.role.permissions.includes(permission);
}

/**
 * ユーザーが複数の権限のいずれかを持っているかチェックする
 * @param session ユーザーセッション
 * @param permissions 必要な権限の配列
 * @returns いずれかの権限を持っている場合はtrue、そうでない場合はfalse
 */
export function hasAnyPermission(session: Session | null, permissions: string[]): boolean {
  if (!session || !session.user || !session.user.role) {
    return false;
  }
  
  return permissions.some(permission => 
    session.user.role!.permissions.includes(permission)
  );
}

/**
 * ユーザーが複数の権限すべてを持っているかチェックする
 * @param session ユーザーセッション
 * @param permissions 必要な権限の配列
 * @returns すべての権限を持っている場合はtrue、そうでない場合はfalse
 */
export function hasAllPermissions(session: Session | null, permissions: string[]): boolean {
  if (!session || !session.user || !session.user.role) {
    return false;
  }
  
  return permissions.every(permission => 
    session.user.role!.permissions.includes(permission)
  );
}

/**
 * 権限グループの定義
 * アプリケーション全体で使用される権限を定義
 */
export const permissionGroups = [
  {
    name: "ユーザー管理",
    permissions: [
      { id: "user:create", label: "ユーザー作成" },
      { id: "user:read", label: "ユーザー閲覧" },
      { id: "user:update", label: "ユーザー更新" },
      { id: "user:delete", label: "ユーザー削除" },
    ],
  },
  {
    name: "ロール管理",
    permissions: [
      { id: "role:create", label: "ロール作成" },
      { id: "role:read", label: "ロール閲覧" },
      { id: "role:update", label: "ロール更新" },
      { id: "role:delete", label: "ロール削除" },
    ],
  },
  {
    name: "アプリ",
    permissions: [
      { id: "page:demo1", label: "デモ1アプリケーション" },
      { id: "page:demo2", label: "デモ2アプリケーション" },
    ],
  },
];

/**
 * すべての権限IDを取得
 */
export const allPermissions = permissionGroups.flatMap(group => 
  group.permissions.map(p => p.id)
);

/**
 * 権限IDからラベルを取得
 * @param permissionId 権限ID
 * @returns 権限ラベル
 */
export function getPermissionLabel(permissionId: string): string {
  for (const group of permissionGroups) {
    const permission = group.permissions.find(p => p.id === permissionId);
    if (permission) {
      return permission.label;
    }
  }
  return permissionId;
} 