"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertCircle, CheckCircle2, Plus, Pencil, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";
import { 
  Alert, 
  AlertTitle, 
  AlertDescription 
} from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { UsersSkeleton } from "@/components/SkeletonLoading";

// ユーザーの型定義
interface User {
  id: string;
  name: string;
  email: string;
  roleId: string | null;
  role?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

// ロールの型定義
interface Role {
  id: string;
  name: string;
  description: string | null;
}

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // 認証チェック
  useEffect(() => {
    if (status === "unauthenticated") {
      // 直接リダイレクトして履歴をリセット
      window.location.replace('/login');
    } else if (
      status === "authenticated" &&
      (!session.user.role || !session.user.role.permissions.includes("user:read"))
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // ユーザー一覧とロール一覧の取得
  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers();
      fetchRoles();
    }
  }, [status]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("ユーザーの取得に失敗しました");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      setError("ユーザーの取得中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      if (!response.ok) {
        throw new Error("ロールの取得に失敗しました");
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("ロール取得エラー:", error);
      setError("ロールの取得中にエラーが発生しました");
    }
  };

  // ユーザーの削除
  const handleDelete = async () => {
    if (!currentUser) return;

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ユーザーの削除に失敗しました");
      }

      setSuccess("ユーザーが正常に削除されました");
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("ユーザーの削除中にエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ユーザーの作成/更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const url = formData.id ? `/api/users/${formData.id}` : "/api/users";
      const method = formData.id ? "PUT" : "POST";

      // 更新時にパスワードが空の場合は送信しない
      const body = formData.id && !formData.password
        ? {
            name: formData.name,
            email: formData.email,
            roleId: formData.roleId,
          }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ユーザーの保存に失敗しました");
      }

      setSuccess(
        formData.id
          ? "ユーザーが正常に更新されました"
          : "ユーザーが正常に作成されました"
      );
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("ユーザーの保存中にエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // フォームの初期化
  const initializeForm = (user?: User) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name,
        email: user.email,
        password: "", // 編集時はパスワードを空にする
        roleId: user.roleId || "",
      });
      setCurrentUser(user);
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
        roleId: "",
      });
      setCurrentUser(null);
    }
  };

  // フォーム入力の処理
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // セレクト入力の処理
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ローディング中の表示
  if (isLoading) {
    return <UsersSkeleton />;
  }

  // 検索でフィルタリングされたユーザー
  const filteredUsers = users.filter(user => {
    return searchTerm === "" || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false;
  });

  // コンテンツをPageTransitionでラップして表示
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className="overflow-hidden"
    >
      <div className="space-y-6">
        {/* ページヘッダー - ページタイトルは既にヘッダーコンポーネントに表示されているため省略 */}
        <div className="hidden">
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        </div>

        {/* 成功メッセージ */}
        {success && (
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertTitle>成功</AlertTitle>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* エラーメッセージ */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 検索と新規作成 */}
        <Card>
          <CardHeader>
            <CardTitle>ユーザー検索</CardTitle>
            <CardDescription>
              名前、メールアドレス、ロールで検索できます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-1/2 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="ユーザーを検索..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus={false}
                />
              </div>
              <Dialog open={isDialogOpen} onOpenChange={(open) => {
                setIsDialogOpen(open);
                // ダイアログが閉じたときにエラーをクリア
                if (!open) {
                  setError("");
                }
              }}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      initializeForm();
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    新規ユーザー作成
                  </Button>
                </DialogTrigger>
                <DialogContent 
                  className="sm:max-w-[500px]"
                  autoFocus={false}
                  onOpenAutoFocus={(e) => e.preventDefault()}
                  onInteractOutside={() => {
                    // モーダル外クリックでモーダルを閉じる
                    setIsDialogOpen(false);
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>
                      {formData.id ? "ユーザーの編集" : "新規ユーザーの作成"}
                    </DialogTitle>
                    <DialogDescription>
                      ユーザー情報を入力してください
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          名前
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="col-span-3"
                          required
                          autoFocus={false}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                          メールアドレス
                        </Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="col-span-3"
                          required
                          autoFocus={false}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          パスワード
                        </Label>
                        <div className="relative col-span-3">
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            className="pr-10"
                            required={!formData.id} // 新規作成時のみ必須
                            placeholder={formData.id ? "変更しない場合は空白" : ""}
                            autoFocus={false}
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="roleId" className="text-right">
                          ロール
                        </Label>
                        <Select
                          value={formData.roleId}
                          onValueChange={(value) => handleSelectChange("roleId", value)}
                          required
                        >
                          <SelectTrigger className="col-span-3" autoFocus={false}>
                            <SelectValue placeholder="ロールを選択" />
                          </SelectTrigger>
                          <SelectContent 
                            autoFocus={false}
                          >
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {error && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>エラー</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        キャンセル
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading
                          ? "保存中..."
                          : formData.id
                          ? "更新する"
                          : "作成する"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* ユーザー一覧 */}
        <Card className="flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle>ユーザー一覧</CardTitle>
            <CardDescription>
              {filteredUsers.length === 0 
                ? "検索条件に一致するユーザーがありません" 
                : `${filteredUsers.length}件のユーザーが見つかりました`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-25rem)]">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="bg-white border-b">名前</TableHead>
                    <TableHead className="bg-white border-b">メールアドレス</TableHead>
                    <TableHead className="bg-white border-b">ロール</TableHead>
                    <TableHead className="text-right bg-white border-b">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        ユーザーが見つかりません
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role?.name || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                initializeForm(user);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">編集</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setCurrentUser(user);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">削除</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 削除確認ダイアログ */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={(open) => {
          setIsDeleteDialogOpen(open);
          // ダイアログが閉じたときにエラーをクリア
          if (!open) {
            setError("");
          }
        }}>
          <DialogContent 
            className="sm:max-w-[425px]"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>ユーザーの削除</DialogTitle>
              <DialogDescription>
                このユーザーを削除してもよろしいですか？この操作は元に戻せません。
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700">
                ユーザー名: <span className="font-medium">{currentUser?.name}</span>
              </p>
              <p className="text-sm text-gray-700">
                メールアドレス: <span className="font-medium">{currentUser?.email}</span>
              </p>
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>エラー</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                削除する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
} 