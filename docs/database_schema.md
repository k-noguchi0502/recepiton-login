# データベーススキーマ

## テーブル構成

### Roleテーブル
| フィールド名 | データ型 | 説明 |
|------------|---------|------|
| id | String | 主キー、CUID形式 |
| name | String | ロール名（一意） |
| description | String? | ロールの説明（任意） |
| permissions | String[] | 権限のリスト |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

### Userテーブル
| フィールド名 | データ型 | 説明 |
|------------|---------|------|
| id | String | 主キー、CUID形式 |
| name | String? | ユーザー名（任意） |
| email | String? | メールアドレス（一意） |
| password | String? | ハッシュ化されたパスワード |
| image | String? | プロフィール画像URL（任意） |
| roleId | String? | 外部キー（Roleテーブルへの参照） |
| createdAt | DateTime | 作成日時 |
| updatedAt | DateTime | 更新日時 |

## ER図

```
+----------------+       +----------------+
|      Role      |       |      User      |
+----------------+       +----------------+
| id (PK)        |       | id (PK)        |
| name           |       | name           |
| description    |       | email          |
| permissions    |       | password       |
| createdAt      |       | image          |
| updatedAt      |       | roleId (FK)    |
|                |       | createdAt      |
|                |       | updatedAt      |
+----------------+       +----------------+
        |                        |
        |                        |
        +------------------------+
                  1:N
```

## リレーションシップ

1. **Role - User**: 1対多のリレーションシップ
   - 1つのロールは複数のユーザーに割り当てることができます
   - 各ユーザーは1つのロールのみを持つことができます

## インデックス

- **User.email**: ユーザーのメールアドレスに対するユニークインデックス
- **Role.name**: ロール名に対するユニークインデックス

## 制約

- **User.email**: ユニーク制約（同じメールアドレスを持つユーザーは作成できない）
- **Role.name**: ユニーク制約（同じ名前のロールは作成できない）
- **User.roleId**: 外部キー制約（存在するロールIDのみ設定可能）

## 初期データ（シード）

### デフォルトロール
1. **admin**（管理者）
   - 説明: 管理者権限
   - 権限: すべての権限

2. **user**（一般ユーザー）
   - 説明: 一般ユーザー権限
   - 権限: user:read

3. **viewer**（閲覧者）
   - 説明: 閲覧専用権限
   - 権限: user:read

### デフォルトユーザー
1. **管理者ユーザー**
   - メールアドレス: admin@example.com
   - パスワード: Admin@123（ハッシュ化されて保存）
   - ロール: admin 