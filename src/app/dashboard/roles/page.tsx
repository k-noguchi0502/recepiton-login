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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
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
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { RolesSkeleton } from "@/components/SkeletonLoading";
import { toast } from "sonner";
import { Role, PermissionGroup, RoleFormData } from "@/types";

// 権限グループの型アサーション
const typedPermissionGroups = permissionGroups as PermissionGroup[];

export default function RolesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<RoleFormData>({
    id: "",
    name: "",
    description: "",
    permissions: [],
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

  // 権限チェック用のヘルパー関数（ローカル版）
  const checkPermission = (permission: string): boolean => {
    return hasPermission(session, permission);
  };

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
      toast.error("エラー", {
        description: "ロールの取得中にエラーが発生しました",
        duration: 5000,
      });
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

  // ロールの削除
  const handleDelete = async () => {
    if (!currentRole) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/roles/${currentRole.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ロールの削除に失敗しました");
      }

      toast.success("削除完了", {
        description: `ロール「${currentRole.name}」が正常に削除されました`,
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      fetchRoles();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("エラー", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("エラー", {
          description: "ロールの削除中にエラーが発生しました",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ロールの作成/更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = formData.id ? `/api/roles/${formData.id}` : "/api/roles";
      const method = formData.id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ロールの保存に失敗しました");
      }

      if (formData.id) {
        toast.success("更新完了", {
          description: "ロールが正常に更新されました",
          duration: 3000,
        });
      } else {
        toast.success("作成完了", {
          description: "ロールが正常に作成されました",
          duration: 3000,
        });
      }
      
      setIsDialogOpen(false);
      fetchRoles();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("エラー", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("エラー", {
          description: "ロールの保存中にエラーが発生しました",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 権限の切り替え
  const togglePermission = (permission: string) => {
    setFormData((prev) => {
      const permissions = [...prev.permissions];
      const index = permissions.indexOf(permission);
      if (index === -1) {
        permissions.push(permission);
      } else {
        permissions.splice(index, 1);
      }
      return { ...prev, permissions };
    });
  };

  // フォーム入力の処理
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 検索でフィルタリングされたロール
  const filteredRoles = roles.filter((role) => {
    return (
      searchTerm === "" ||
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.description &&
        role.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  // ローディング中の表示
  if (isLoading && roles.length === 0) {
    return <RolesSkeleton />;
  }

  // コンテンツをPageTransitionでラップして表示
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
        </div>

        {/* 検索と新規作成 */}
        <Card>
          <CardHeader>
            <CardTitle>ロール検索</CardTitle>
            <CardDescription>
              ロール名や説明で検索できます
            </CardDescription>
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
                  autoFocus={false}
                />
              </div>
              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                  setIsDialogOpen(open);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      initializeForm();
                    }}
                    disabled={!checkPermission("role:create")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    新規ロール作成
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
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

                      <Separator className="my-4" />

                      <div className="grid gap-4">
                        <h3 className="text-lg font-medium">権限設定</h3>
                        <p className="text-sm text-gray-500">
                          このロールに付与する権限を選択してください
                        </p>

                        {typedPermissionGroups.map((group) => (
                          <div key={group.name} className="space-y-2">
                            <h4 className="font-medium">{group.name}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                                    className="cursor-pointer"
                                  >
                                    {permission.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            <Separator className="my-2" />
                          </div>
                        ))}
                      </div>
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
                        disabled={isSubmitting}
                      >
                        {isSubmitting
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

        {/* ロール一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>ロール一覧</CardTitle>
            <CardDescription>
              システムに登録されているロールの一覧です
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 animate-pulse rounded-md" />
                <div className="h-8 bg-gray-200 animate-pulse rounded-md" />
                <div className="h-8 bg-gray-200 animate-pulse rounded-md" />
              </div>
            ) : filteredRoles.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm
                  ? "検索条件に一致するロールが見つかりませんでした"
                  : "ロールが登録されていません"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ロール名</TableHead>
                      <TableHead>説明</TableHead>
                      <TableHead>権限数</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRoles.map((role) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">
                          {role.name}
                        </TableCell>
                        <TableCell>{role.description || "-"}</TableCell>
                        <TableCell>{role.permissions.length}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                initializeForm(role);
                                setIsDialogOpen(true);
                              }}
                              disabled={!checkPermission("role:update")}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">編集</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setCurrentRole(role);
                                setIsDeleteDialogOpen(true);
                              }}
                              disabled={
                                role.name === "admin" ||
                                role.name === "user" ||
                                role.name === "viewer" ||
                                !checkPermission("role:delete")
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">削除</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 削除確認ダイアログ */}
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <DialogContent
            className="sm:max-w-[425px]"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>ロールの削除</DialogTitle>
              <DialogDescription>
                このロールを削除してもよろしいですか？この操作は元に戻せません。
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700">
                ロール名: <span className="font-medium">{currentRole?.name}</span>
              </p>
              <p className="text-sm text-gray-700">
                説明: <span className="font-medium">{currentRole?.description || "-"}</span>
              </p>
              <p className="text-sm text-gray-700 mt-2">
                このロールを削除すると、このロールに割り当てられているユーザーは権限を失います。
              </p>
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "削除中..." : "削除する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </motion.div>
  );
}
