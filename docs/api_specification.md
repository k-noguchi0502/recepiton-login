# API仕様書

## 認証API

### POST /api/auth/[...nextauth]
- **説明**: NextAuthによる認証エンドポイント
- **認証**: 不要
- **リクエストボディ**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    {
      "user": {
        "id": "cuid123",
        "name": "ユーザー名",
        "email": "user@example.com",
        "image": null,
        "role": {
          "id": "cuid456",
          "name": "user",
          "description": "一般ユーザー権限",
          "permissions": ["user:read"]
        }
      }
    }
    ```
  - **エラー** (401 Unauthorized):
    ```json
    {
      "error": "メールアドレスまたはパスワードが正しくありません"
    }
    ```

### POST /api/auth/change-password
- **説明**: パスワード変更エンドポイント
- **認証**: 必要
- **リクエストボディ**:
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "newPassword456"
  }
  ```
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    {
      "message": "パスワードが正常に変更されました"
    }
    ```
  - **エラー** (400 Bad Request):
    ```json
    {
      "error": "現在のパスワードが正しくありません"
    }
    ```
  - **エラー** (401 Unauthorized):
    ```json
    {
      "error": "認証されていません"
    }
    ```

## ユーザーAPI

### GET /api/users
- **説明**: ユーザー一覧取得
- **認証**: 必要
- **権限**: user:read
- **クエリパラメータ**: なし
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    [
      {
        "id": "cuid123",
        "name": "ユーザー1",
        "email": "user1@example.com",
        "roleId": "cuid456",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "role": {
          "id": "cuid456",
          "name": "user"
        }
      },
      {
        "id": "cuid789",
        "name": "ユーザー2",
        "email": "user2@example.com",
        "roleId": "cuid012",
        "createdAt": "2023-01-02T00:00:00.000Z",
        "role": {
          "id": "cuid012",
          "name": "admin"
        }
      }
    ]
    ```
  - **エラー** (401 Unauthorized):
    ```json
    {
      "error": "認証されていません"
    }
    ```
  - **エラー** (403 Forbidden):
    ```json
    {
      "error": "権限がありません"
    }
    ```

### POST /api/users
- **説明**: 新規ユーザー作成
- **認証**: 必要
- **権限**: user:create
- **リクエストボディ**:
  ```json
  {
    "name": "新規ユーザー",
    "email": "newuser@example.com",
    "password": "password123",
    "roleId": "cuid456"
  }
  ```
- **レスポンス**:
  - **成功** (201 Created):
    ```json
    {
      "id": "cuid123",
      "name": "新規ユーザー",
      "email": "newuser@example.com",
      "roleId": "cuid456",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "role": {
        "id": "cuid456",
        "name": "user"
      }
    }
    ```
  - **エラー** (400 Bad Request):
    ```json
    {
      "error": "必須項目が不足しています"
    }
    ```
    または
    ```json
    {
      "error": "このメールアドレスは既に使用されています"
    }
    ```
  - **エラー** (401 Unauthorized):
    ```json
    {
      "error": "認証されていません"
    }
    ```
  - **エラー** (403 Forbidden):
    ```json
    {
      "error": "権限がありません"
    }
    ```

### GET /api/users/[id]
- **説明**: 特定ユーザー情報取得
- **認証**: 必要
- **権限**: user:read
- **パスパラメータ**: id - ユーザーID
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    {
      "id": "cuid123",
      "name": "ユーザー名",
      "email": "user@example.com",
      "roleId": "cuid456",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z",
      "role": {
        "id": "cuid456",
        "name": "user",
        "description": "一般ユーザー権限"
      }
    }
    ```
  - **エラー** (404 Not Found):
    ```json
    {
      "error": "ユーザーが見つかりません"
    }
    ```

### PUT /api/users/[id]
- **説明**: ユーザー情報更新
- **認証**: 必要
- **権限**: user:update
- **パスパラメータ**: id - ユーザーID
- **リクエストボディ**:
  ```json
  {
    "name": "更新後の名前",
    "email": "updated@example.com",
    "roleId": "cuid789"
  }
  ```
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    {
      "id": "cuid123",
      "name": "更新後の名前",
      "email": "updated@example.com",
      "roleId": "cuid789",
      "role": {
        "id": "cuid789",
        "name": "admin"
      }
    }
    ```
  - **エラー** (400 Bad Request):
    ```json
    {
      "error": "このメールアドレスは既に使用されています"
    }
    ```
  - **エラー** (404 Not Found):
    ```json
    {
      "error": "ユーザーが見つかりません"
    }
    ```

### DELETE /api/users/[id]
- **説明**: ユーザー削除
- **認証**: 必要
- **権限**: user:delete
- **パスパラメータ**: id - ユーザーID
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    {
      "message": "ユーザーが正常に削除されました"
    }
    ```
  - **エラー** (404 Not Found):
    ```json
    {
      "error": "ユーザーが見つかりません"
    }
    ```

## ロールAPI

### GET /api/roles
- **説明**: ロール一覧取得
- **認証**: 必要
- **権限**: role:read
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    [
      {
        "id": "cuid123",
        "name": "admin",
        "description": "管理者権限",
        "permissions": ["user:create", "user:read", "user:update", "user:delete"]
      },
      {
        "id": "cuid456",
        "name": "user",
        "description": "一般ユーザー権限",
        "permissions": ["user:read"]
      }
    ]
    ```
  - **エラー** (401 Unauthorized):
    ```json
    {
      "error": "認証が必要です"
    }
    ```
  - **エラー** (403 Forbidden):
    ```json
    {
      "error": "権限がありません"
    }
    ```

### POST /api/roles
- **説明**: 新規ロール作成
- **認証**: 必要
- **権限**: role:create
- **リクエストボディ**:
  ```json
  {
    "name": "editor",
    "description": "編集者権限",
    "permissions": ["user:read", "user:update"]
  }
  ```
- **レスポンス**:
  - **成功** (201 Created):
    ```json
    {
      "id": "cuid789",
      "name": "editor",
      "description": "編集者権限",
      "permissions": ["user:read", "user:update"]
    }
    ```
  - **エラー** (400 Bad Request):
    ```json
    {
      "error": "ロール名は必須です"
    }
    ```
    または
    ```json
    {
      "error": "このロール名は既に使用されています"
    }
    ```

### GET /api/roles/[id]
- **説明**: 特定ロール情報取得
- **認証**: 必要
- **権限**: role:read
- **パスパラメータ**: id - ロールID
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    {
      "id": "cuid123",
      "name": "admin",
      "description": "管理者権限",
      "permissions": ["user:create", "user:read", "user:update", "user:delete"],
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
    ```
  - **エラー** (404 Not Found):
    ```json
    {
      "error": "ロールが見つかりません"
    }
    ```

### PUT /api/roles/[id]
- **説明**: ロール情報更新
- **認証**: 必要
- **権限**: role:update
- **パスパラメータ**: id - ロールID
- **リクエストボディ**:
  ```json
  {
    "name": "super-admin",
    "description": "スーパー管理者権限",
    "permissions": ["user:create", "user:read", "user:update", "user:delete", "role:create", "role:read", "role:update", "role:delete"]
  }
  ```
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    {
      "id": "cuid123",
      "name": "super-admin",
      "description": "スーパー管理者権限",
      "permissions": ["user:create", "user:read", "user:update", "user:delete", "role:create", "role:read", "role:update", "role:delete"]
    }
    ```
  - **エラー** (400 Bad Request):
    ```json
    {
      "error": "このロール名は既に使用されています"
    }
    ```
  - **エラー** (404 Not Found):
    ```json
    {
      "error": "ロールが見つかりません"
    }
    ```

### DELETE /api/roles/[id]
- **説明**: ロール削除
- **認証**: 必要
- **権限**: role:delete
- **パスパラメータ**: id - ロールID
- **レスポンス**:
  - **成功** (200 OK):
    ```json
    {
      "message": "ロールが正常に削除されました"
    }
    ```
  - **エラー** (400 Bad Request):
    ```json
    {
      "error": "このロールは使用中のため削除できません"
    }
    ```
  - **エラー** (404 Not Found):
    ```json
    {
      "error": "ロールが見つかりません"
    }
    ``` 