"use client";

/**
 * 認証関連のユーティリティ関数
 */

/**
 * ユーザーが特定の権限を持っているかチェックする
 * @param userPermissions ユーザーの権限配列
 * @param requiredPermissions 必要な権限配列
 * @returns 権限を持っている場合はtrue、そうでない場合はfalse
 */
export function hasPermission(
  userPermissions: string[] | undefined,
  requiredPermissions?: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!userPermissions || userPermissions.length === 0) return false;
  
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
}

/**
 * ユーザーが全ての必要な権限を持っているかチェックする
 * @param userPermissions ユーザーの権限配列
 * @param requiredPermissions 必要な権限配列
 * @returns 全ての権限を持っている場合はtrue、そうでない場合はfalse
 */
export function hasAllPermissions(
  userPermissions: string[] | undefined,
  requiredPermissions?: string[]
): boolean {
  if (!requiredPermissions || requiredPermissions.length === 0) return true;
  if (!userPermissions || userPermissions.length === 0) return false;
  
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
}

/**
 * ユーザーのメールアドレスをローカルストレージに保存する
 * @param email メールアドレス
 * @param remember 保存するかどうか
 */
export function saveUserEmail(email: string, remember: boolean): void {
  if (typeof window !== 'undefined') {
    if (remember) {
      localStorage.setItem("savedEmail", email);
    } else {
      localStorage.removeItem("savedEmail");
    }
  }
}

/**
 * 保存されたメールアドレスを取得する
 * @returns 保存されたメールアドレス、なければnull
 */
export function getSavedEmail(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("savedEmail");
  }
  return null;
} 