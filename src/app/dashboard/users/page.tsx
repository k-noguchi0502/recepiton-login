"use client";

import { useState, useEffect, useCallback } from "react";
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
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { UsersSkeleton } from "@/components/SkeletonLoading";
import { toast } from "sonner";
import { User, Role, Company, Department, UserFormData } from "@/types";

export default function UsersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredDepartments, setFilteredDepartments] = useState<Department[]>([]);
  const [allDepartments, setAllDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<UserFormData>({
    id: "",
    name: "",
    email: "",
    password: "",
    roleId: "",
    companyId: "",
    departmentId: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // 認証チェック
  useEffect(() => {
    if (status === "unauthenticated") {
      // 直接リダイレクトして履歴をリセット
      window.location.replace("/login");
    } else if (
      status === "authenticated" &&
      (!session.user.role ||
        !session.user.role.permissions.includes("user:read"))
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // 権限チェック用のヘルパー関数
  const hasPermission = useCallback((permission: string): boolean => {
    if (!session || !session.user.role || !session.user.role.permissions) {
      return false;
    }
    return session.user.role.permissions.includes(permission);
  }, [session]);

  // ユーザー一覧とロール一覧の取得
  useEffect(() => {
    if (status === "authenticated") {
      fetchUsers();
      // ロール取得権限がある場合のみロールを取得
      if (hasPermission("role:read")) {
        fetchRoles();
      }
      fetchCompanies();
      fetchAllDepartments();
    }
  }, [status, hasPermission]);

  // 会社一覧の取得
  const fetchCompanies = async () => {
    try {
      const response = await fetch("/api/companies");
      if (!response.ok) {
        throw new Error("会社の取得に失敗しました");
      }
      const data = await response.json();
      setCompanies(data);
    } catch (error) {
      console.error("会社取得エラー:", error);
      toast.error("エラー", {
        description: "会社の取得中にエラーが発生しました",
        duration: 5000,
      });
    }
  };

  // すべての部署を一度に取得
  const fetchAllDepartments = async () => {
    try {
      const response = await fetch("/api/departments");
      if (!response.ok) {
        throw new Error("部署の取得に失敗しました");
      }
      const data = await response.json();
      setAllDepartments(data);
    } catch (error) {
      console.error("部署取得エラー:", error);
      toast.error("エラー", {
        description: "部署の取得中にエラーが発生しました",
        duration: 5000,
      });
    }
  };

  // 会社が変更されたときに部署一覧をフィルタリング
  useEffect(() => {
    if (formData.companyId) {
      const filtered = allDepartments.filter(
        (dept) => dept.companyId === formData.companyId
      );
      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments([]);
    }
  }, [formData.companyId, allDepartments]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("ユーザーの取得に失敗しました");
      }
      const data = await response.json();
      console.log("取得したユーザーデータ:", data);
      setUsers(data);
    } catch (error) {
      console.error("ユーザー取得エラー:", error);
      toast.error("エラー", {
        description: "ユーザーの取得中にエラーが発生しました",
        duration: 5000,
      });
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
      toast.error("エラー", {
        description: "ロールの取得中にエラーが発生しました",
        duration: 5000,
      });
    }
  };

  // ユーザーの削除
  const handleDelete = async () => {
    if (!currentUser) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/users/${currentUser.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "ユーザーの削除に失敗しました");
      }

      toast.success("ユーザーが正常に削除されました", {
        description: `${currentUser.name}を削除しました`,
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("エラー", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("エラー", {
          description: "ユーザーの削除中にエラーが発生しました",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ユーザーの作成/更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = formData.id ? `/api/users/${formData.id}` : "/api/users";
      const method = formData.id ? "PUT" : "POST";

      // 更新時にパスワードが空の場合は送信しない
      const body =
        formData.id && !formData.password
          ? {
              name: formData.name,
              email: formData.email,
              roleId: formData.roleId,
              companyId: formData.companyId,
              departmentId: formData.departmentId,
            }
          : formData;

      // ロール取得権限がなく、新規作成時にロールIDが指定されていない場合はエラー
      if (!hasPermission("role:read") && !formData.id && !formData.roleId) {
        throw new Error("ロール取得権限がないため、ユーザーを作成できません。管理者に連絡してください。");
      }

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

      if (formData.id) {
        toast.success("更新完了", {
          description: "ユーザーが正常に更新されました",
          duration: 3000,
        });
      } else {
        toast.success("作成完了", {
          description: "ユーザーが正常に作成されました",
          duration: 3000,
        });
      }

      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("エラー", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("エラー", {
          description: "ユーザーの保存中にエラーが発生しました",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームの初期化
  const initializeForm = (user?: User) => {
    if (user) {
      setFormData({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        password: "",
        roleId: user.roleId || "",
        companyId: user.companyId || "",
        departmentId: user.departmentId || "",
      });

      // 会社IDがある場合は部署をフィルタリング
      if (user.companyId) {
        const filtered = allDepartments.filter(
          (dept) => dept.companyId === user.companyId
        );
        setFilteredDepartments(filtered);
      }
    } else {
      setFormData({
        id: "",
        name: "",
        email: "",
        password: "",
        roleId: "",
        companyId: "",
        departmentId: "",
      });
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
    // 「none」の場合は空の文字列として扱う
    const actualValue = value === "none" ? "" : value;
    setFormData((prev) => ({ ...prev, [name]: actualValue }));
  };

  // ローディング中の表示
  if (isLoading && users.length === 0) {
    return <UsersSkeleton />;
  }

  // 検索でフィルタリングされたユーザー
  const filteredUsers = users.filter((user) => {
    return (
      searchTerm === "" ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      false
    );
  });

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
          <h1 className="text-2xl font-bold text-gray-900">ユーザー管理</h1>
        </div>

        {/* 検索と新規作成 */}
        <Card>
          <CardHeader>
            <CardTitle>ユーザー検索</CardTitle>
            <CardDescription>
              名前、メールアドレス、ロール（役割）で検索できます
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
                    disabled={!hasPermission("user:create")}
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
                            placeholder={
                              formData.id ? "変更しない場合は空白" : ""
                            }
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
                          ロール（役割）
                        </Label>
                        <Select
                          value={formData.roleId}
                          onValueChange={(value) =>
                            handleSelectChange("roleId", value)
                          }
                          required
                          disabled={!hasPermission("role:read")}
                        >
                          <SelectTrigger
                            className="w-full col-span-3"
                            autoFocus={false}
                          >
                            <SelectValue placeholder={!hasPermission("role:read") ? "ロール取得権限がありません" : "ロール（役割）を選択"} />
                          </SelectTrigger>
                          <SelectContent autoFocus={false}>
                            {hasPermission("role:read") ? roles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                {role.name}
                                {role.description && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    - {role.description}
                                  </span>
                                )}
                              </SelectItem>
                            )) : (
                              <SelectItem value="" disabled>
                                ロール取得権限がありません
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="companyId" className="text-right">
                          会社
                        </Label>
                        <Select
                          value={formData.companyId || "none"}
                          onValueChange={(value) => {
                            handleSelectChange("companyId", value);
                            // 会社が変更されたら部署をリセット
                            setFormData((prev) => ({
                              ...prev,
                              departmentId: "",
                            }));
                          }}
                        >
                          <SelectTrigger
                            className="w-full col-span-3"
                            autoFocus={false}
                          >
                            <SelectValue placeholder="会社を選択" />
                          </SelectTrigger>
                          <SelectContent autoFocus={false}>
                            <SelectItem value="none">選択なし</SelectItem>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="departmentId" className="text-right">
                          部署
                        </Label>
                        <Select
                          value={formData.departmentId || "none"}
                          onValueChange={(value) => handleSelectChange("departmentId", value)}
                          disabled={!formData.companyId || filteredDepartments.length === 0}
                        >
                          <SelectTrigger className="w-full col-span-3" autoFocus={false}>
                            <SelectValue placeholder={
                              !formData.companyId 
                                ? "先に会社を選択してください" 
                                : filteredDepartments.length === 0 
                                  ? "部署がありません" 
                                  : "部署を選択"
                            } />
                          </SelectTrigger>
                          <SelectContent 
                            autoFocus={false}
                          >
                            <SelectItem value="none">選択なし</SelectItem>
                            {filteredDepartments.map((department) => (
                              <SelectItem key={department.id} value={department.id}>
                                {department.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                    <TableHead className="bg-white border-b">
                      メールアドレス
                    </TableHead>
                    <TableHead className="bg-white border-b">ロール（役割）</TableHead>
                    <TableHead className="bg-white border-b">会社</TableHead>
                    <TableHead className="bg-white border-b">部署</TableHead>
                    <TableHead className="text-right bg-white border-b">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        ユーザーが見つかりません
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role?.name || "-"}</TableCell>
                        <TableCell>{user.company?.name || "-"}</TableCell>
                        <TableCell>{user.department?.name || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                initializeForm(user);
                                setIsDialogOpen(true);
                              }}
                              disabled={!hasPermission("user:update")}
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
                              disabled={!hasPermission("user:delete")}
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
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={(open) => {
            setIsDeleteDialogOpen(open);
          }}
        >
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
                ユーザー名:{" "}
                <span className="font-medium">{currentUser?.name}</span>
              </p>
              <p className="text-sm text-gray-700">
                メールアドレス:{" "}
                <span className="font-medium">{currentUser?.email}</span>
              </p>
              {currentUser?.role && (
                <p className="text-sm text-gray-700">
                  ロール（役割）:{" "}
                  <span className="font-medium">
                    {currentUser.role.name}
                    {currentUser.role.description && (
                      <span className="ml-1 text-xs text-gray-500">
                        - {currentUser.role.description}
                      </span>
                    )}
                  </span>
                </p>
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
