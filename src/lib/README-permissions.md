# 権限システムの実装

このドキュメントでは、アプリケーションの権限システムの実装について説明します。

## 概要

権限システムは以下のコンポーネントで構成されています：

1. **権限定義**: 各機能に対する権限を定義
2. **ロール**: 複数の権限をグループ化したもの
3. **ユーザー**: 特定のロールを持つ
4. **権限チェック**: ユーザーが特定の操作を実行できるかを確認する機能

## 権限の定義

権限は `src/lib/permissions.ts` で定義されています。各権限は以下の形式で定義されています：

```typescript
{ id: "permission:action", label: "権限の表示名" }
```

例：
- `user:create` - ユーザー作成権限
- `role:read` - ロール閲覧権限

権限は機能領域ごとにグループ化されています：

1. **ユーザー管理**
   - `user:create` - ユーザー作成
   - `user:read` - ユーザー閲覧
   - `user:update` - ユーザー更新
   - `user:delete` - ユーザー削除

2. **ロール管理**
   - `role:create` - ロール作成
   - `role:read` - ロール閲覧
   - `role:update` - ロール更新
   - `role:delete` - ロール削除

3. **アプリ**
   - `page:demo1` - デモ1アプリケーション
   - `page:demo2` - デモ2アプリケーション

## データモデル

### Role モデル

```prisma
model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  permissions String[] // 権限IDの配列
  users       User[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### User モデル

```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String?  @unique
  password  String?
  image     String?
  roleId    String?
  role      Role?    @relation(fields: [roleId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 権限チェック関数

`src/lib/permissions.ts` には以下の権限チェック関数が定義されています：

1. **hasPermission**: ユーザーが特定の権限を持っているかチェック
2. **hasAnyPermission**: ユーザーが複数の権限のいずれかを持っているかチェック
3. **hasAllPermissions**: ユーザーが複数の権限すべてを持っているかチェック

## 認証・権限ミドルウェア

`src/middleware/auth.ts` には以下のミドルウェア関数が定義されています：

1. **withAuth**: 認証が必要なAPIエンドポイント用
2. **withPermission**: 特定の権限が必要なAPIエンドポイント用
3. **withAnyPermission**: 複数の権限のいずれかが必要なAPIエンドポイント用
4. **withAdmin**: 管理者ロール用

## 使用例

### APIでの使用例

```typescript
// 認証のみが必要なエンドポイント
export const GET = withAuth(async (req, _context, session) => {
  // ...
});

// 特定の権限が必要なエンドポイント
export const POST = withPermission("user:create", async (req, _context, session) => {
  // ...
});

// 複数の権限のいずれかが必要なエンドポイント
export const PUT = withAnyPermission(["user:update", "role:update"], async (req, _context, session) => {
  // ...
});
```

### コンポーネントでの使用例

```tsx
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/permissions";

export default function AdminComponent() {
  const { data: session } = useSession();
  
  // 権限チェック
  if (!hasPermission(session, "user:admin")) {
    return <p>権限がありません</p>;
  }
  
  return (
    <div>
      {/* 管理者向けコンテンツ */}
    </div>
  );
}
```

## 権限の追加方法

新しい権限を追加するには：

1. `src/lib/permissions.ts` の `permissionGroups` に新しい権限を追加
2. 必要に応じて新しい権限グループを作成
3. APIやコンポーネントで新しい権限を使用

## ベストプラクティス

1. 直接ロール名をチェックするのではなく、常に権限ベースでチェックする
2. 複数の権限が必要な場合は `hasAllPermissions` を使用
3. 複数の権限のいずれかが必要な場合は `hasAnyPermission` を使用
4. フロントエンドでは権限に基づいてUIを条件付きでレンダリング 