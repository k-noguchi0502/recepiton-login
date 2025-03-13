import { User } from "@/types";

interface UserInfoCardProps {
  user: User | undefined;
  className?: string;
}

/**
 * ユーザー情報カードコンポーネント
 * ユーザーの基本情報と権限を表示します
 */
export function UserInfoCard({ user, className }: UserInfoCardProps) {
  return (
    <div className={`${className}`}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-gray-500">名前</p>
          <p className="mt-1 text-sm text-gray-900">{user?.name || "未設定"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">メールアドレス</p>
          <p className="mt-1 text-sm text-gray-900">{user?.email || "未設定"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">ユーザーID</p>
          <p className="mt-1 text-sm text-gray-900">{user?.id || "未設定"}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">ロール</p>
          <p className="mt-1 text-sm text-gray-900">
            {user?.role?.name || "未設定"}
            {user?.role?.description && (
              <span className="ml-2 text-xs text-gray-500">
                ({user.role.description})
              </span>
            )}
          </p>
        </div>
        <div className="sm:col-span-2">
          <p className="text-sm font-medium text-gray-500">権限</p>
          <div className="mt-1">
            {user?.role?.permissions ? (
              <div className="flex flex-wrap gap-1">
                {user.role.permissions.map((permission, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {permission}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-900">未設定</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 