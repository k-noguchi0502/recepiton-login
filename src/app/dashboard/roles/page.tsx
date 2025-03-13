"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  Pencil,
  Trash2,
  Search,
} from "lucide-react";
import { permissionGroups, hasPermission } from "@/lib/permissions";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { RolesSkeleton } from "@/components/SkeletonLoading";

// ロールの型定義
interface Role {
  id: string;
  name: string;
  description: string | null;
  permissions: string[];
}

// 権限グループの型定義
interface PermissionGroup {
  name: string;
  permissions: {
    id: string;
    label: string;
  }[];
}

// 権限グループの型アサーション
const typedPermissionGroups = permissionGroups as PermissionGroup[];

export default function RolesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    permissions: [] as string[],
  });

  // 認証チェック
  useEffect(() => {
    if (status === "unauthenticated") {
      // 直接リダイレクトして履歴をリセット
      window.location.replace('/login');
    } else if (
      status === "authenticated" &&
      !hasPermission(session, "role:read")
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // ロール一覧の取得
  useEffect(() => {
    if (status === "authenticated") {
      fetchRoles();
    }
  }, [status]);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/roles");
      if (!response.ok) {
        throw new Error("ロールの取得に失敗しました");
      }
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      console.error("ロール取得エラー:", error);
      setError("ロールの取得中にエラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  // フォームの初期化
  const initializeForm = (role?: Role) => {
    if (role) {
      setFormData({
        id: role.id,
        name: role.name,
        description: role.description || "",
        permissions: role.permissions,
      });
      setCurrentRole(role);
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        permissions: [],
      });
      setCurrentRole(null);
    }
  };

  // ロールの作成/更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const url = formData.id ? `/api/roles/${formData.id}` : "/api/roles";
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          permissions: formData.permissions,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ロールの保存に失敗しました");
      }

      setSuccess(
        formData.id
          ? "ロールが正常に更新されました"
          : "ロールが正常に作成されました"
      );
      setIsDialogOpen(false);
      fetchRoles();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("ロールの保存中にエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ロールの削除
  const handleDelete = async () => {
    if (!currentRole) return;

    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch(`/api/roles/${currentRole.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ロールの削除に失敗しました");
      }

      setSuccess("ロールが正常に削除されました");
      setIsDeleteDialogOpen(false);
      fetchRoles();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("ロールの削除中にエラーが発生しました");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 権限の切り替え
  const togglePermission = (permissionId: string) => {
    setFormData((prev) => {
      const permissions = [...prev.permissions];
      if (permissions.includes(permissionId)) {
        return {
          ...prev,
          permissions: permissions.filter((id) => id !== permissionId),
        };
      } else {
        return {
          ...prev,
          permissions: [...permissions, permissionId],
        };
      }
    });
  };

  // フォーム入力の処理
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ローディング中の表示
  if (isLoading) {
    return <RolesSkeleton />;
  }

  // 検索でフィルタリングされたロール
  const filteredRoles = roles.filter((role) => {
    return (
      searchTerm === "" ||
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description &&
        role.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      false
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.3,
        ease: "easeOut",
      }}
      className="overflow-hidden"
    >
      <div className="space-y-6">
        {/* ページヘッダー - ページタイトルは既にヘッダーコンポーネントに表示されているため省略 */}
        <div className="hidden">
          <h1 className="text-2xl font-bold text-gray-900">ロール管理</h1>
          <p className="mt-1 text-sm text-gray-500">
            システム内のロールと権限を管理します
          </p>
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
            <CardTitle>ロール検索</CardTitle>
            <CardDescription>名前や説明で検索できます</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-1/2 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="ロールを検索..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {hasPermission(session, "role:create") && (
                <Button
                  onClick={() => {
                    initializeForm();
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  新規ロール作成
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ロール一覧 */}
        <Card className="flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle>ロール一覧</CardTitle>
            <CardDescription>
              {filteredRoles.length === 0
                ? "検索条件に一致するロールがありません"
                : `${filteredRoles.length}件のロールが見つかりました`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-25rem)]">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="bg-white border-b">
                      ロール名
                    </TableHead>
                    <TableHead className="bg-white border-b">説明</TableHead>
                    <TableHead className="bg-white border-b">権限数</TableHead>
                    <TableHead className="text-right bg-white border-b">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        ロールが見つかりません
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          {role.name}
                        </TableCell>
                        <TableCell>{role.description || "-"}</TableCell>
                        <TableCell>{role.permissions.length}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {hasPermission(session, "role:update") && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  initializeForm(role);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">編集</span>
                              </Button>
                            )}
                            {hasPermission(session, "role:delete") && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => {
                                  setCurrentRole(role);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">削除</span>
                              </Button>
                            )}
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
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent
            className="sm:max-w-[425px]"
            autoFocus={false}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={() => {
              // モーダル外クリックでモーダルを閉じる
              setIsDeleteDialogOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>ロールの削除</DialogTitle>
              <DialogDescription>
                このロールを削除してもよろしいですか？この操作は元に戻せません。
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700">
                ロール名:{" "}
                <span className="font-medium">{currentRole?.name}</span>
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
                disabled={isLoading}
              >
                {isLoading ? "削除中..." : "削除する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ロール作成/編集ダイアログ */}
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            // ダイアログが開いたときにフォーカスを外す
            if (open) {
              setTimeout(() => {
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }, 50);
            }
          }}
        >
          <DialogContent
            className="sm:max-w-[600px]"
            autoFocus={false}
            onOpenAutoFocus={(e) => e.preventDefault()}
            onInteractOutside={() => {
              // モーダル外クリックでモーダルを閉じる
              setIsDialogOpen(false);
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {formData.id ? "ロールの編集" : "新規ロールの作成"}
              </DialogTitle>
              <DialogDescription>
                ロール情報と権限を設定してください
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    ロール名
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
                  <Label htmlFor="description" className="text-right">
                    説明
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="col-span-3"
                    autoFocus={false}
                  />
                </div>

                <Separator className="my-2" />

                <div className="grid grid-cols-1 gap-4">
                  <Label className="mb-2">権限</Label>
                  <div className="space-y-4">
                    {typedPermissionGroups.map((group) => (
                      <div key={group.name} className="space-y-2">
                        <h4 className="font-medium text-sm">{group.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {group.permissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={permission.id}
                                checked={formData.permissions.includes(
                                  permission.id
                                )}
                                onCheckedChange={() =>
                                  togglePermission(permission.id)
                                }
                              />
                              <Label
                                htmlFor={permission.id}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {permission.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
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
    </motion.div>
  );
}
