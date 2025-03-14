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
import {
  Plus,
  Pencil,
  Trash2,
  Search,
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { DepartmentsSkeleton } from "@/components/SkeletonLoading";
import { toast } from "sonner";
import { Company, Department, DepartmentFormData } from "@/types";

export default function DepartmentsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<string>("all");
  const [formData, setFormData] = useState<DepartmentFormData>({
    id: "",
    name: "",
    description: "",
    companyId: "",
  });

  // 認証チェック
  useEffect(() => {
    if (status === "unauthenticated") {
      // 直接リダイレクトして履歴をリセット
      window.location.replace("/login");
    } else if (
      status === "authenticated" &&
      (!session.user.role || !session.user.role.permissions.includes("department:read"))
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // 権限チェック用のヘルパー関数
  const hasPermission = (permission: string): boolean => {
    if (!session || !session.user.role || !session.user.role.permissions) {
      return false;
    }
    return session.user.role.permissions.includes(permission);
  };

  // 会社一覧の取得
  useEffect(() => {
    if (status === "authenticated") {
      fetchCompanies();
    }
  }, [status]);

  // 会社が選択されたら部署一覧を取得
  useEffect(() => {
    if (selectedCompany === "all") {
      fetchAllDepartments();
    } else if (selectedCompany) {
      fetchDepartments(selectedCompany);
    }
  }, [selectedCompany]);

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

  const fetchAllDepartments = async () => {
    let retryCount = 0;
    const maxRetries = 3;
    
    try {
      setIsLoading(true);
      
      const fetchWithRetry = async () => {
        try {
          const response = await fetch("/api/departments");
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "部署の取得に失敗しました");
          }
          return await response.json();
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`部署データ取得リトライ (${retryCount}/${maxRetries})...`);
            // 指数バックオフでリトライ (300ms, 900ms, 2700ms)
            await new Promise(resolve => setTimeout(resolve, 300 * Math.pow(3, retryCount - 1)));
            return fetchWithRetry();
          }
          throw error;
        }
      };
      
      const data = await fetchWithRetry();
      setDepartments(data);
    } catch (error) {
      console.error("部署取得エラー:", error);
      toast.error("エラー", {
        description: error instanceof Error ? error.message : "部署の取得中にエラーが発生しました",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDepartments = async (companyId: string) => {
    let retryCount = 0;
    const maxRetries = 3;
    
    try {
      setIsLoading(true);
      
      const fetchWithRetry = async () => {
        try {
          const response = await fetch(`/api/companies/${companyId}/departments`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "部署の取得に失敗しました");
          }
          return await response.json();
        } catch (error) {
          if (retryCount < maxRetries) {
            retryCount++;
            console.log(`部署データ取得リトライ (${retryCount}/${maxRetries})...`);
            // 指数バックオフでリトライ (300ms, 900ms, 2700ms)
            await new Promise(resolve => setTimeout(resolve, 300 * Math.pow(3, retryCount - 1)));
            return fetchWithRetry();
          }
          throw error;
        }
      };
      
      const data = await fetchWithRetry();
      setDepartments(data);
    } catch (error) {
      console.error("部署取得エラー:", error);
      toast.error("エラー", {
        description: error instanceof Error ? error.message : "部署の取得中にエラーが発生しました",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 部署の削除
  const handleDelete = async () => {
    if (!currentDepartment) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/departments/${currentDepartment.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "部署の削除に失敗しました");
      }

      toast.success("削除完了", {
        description: `部署「${currentDepartment.name}」が正常に削除されました`,
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      
      // 現在選択されている会社の部署一覧を再取得
      if (selectedCompany === "all") {
        fetchAllDepartments();
      } else {
        fetchDepartments(selectedCompany);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("エラー", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("エラー", {
          description: "部署の削除中にエラーが発生しました",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 部署の作成/更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = formData.id ? `/api/departments/${formData.id}` : "/api/departments";
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
        throw new Error(data.error || "部署の保存に失敗しました");
      }

      if (formData.id) {
        toast.success("更新完了", {
          description: "部署が正常に更新されました",
          duration: 3000,
        });
      } else {
        toast.success("作成完了", {
          description: "部署が正常に作成されました",
          duration: 3000,
        });
      }
      
      setIsDialogOpen(false);
      
      // 現在選択されている会社の部署一覧を再取得
      if (selectedCompany === "all") {
        fetchAllDepartments();
      } else {
        fetchDepartments(selectedCompany);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error("エラー", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("エラー", {
          description: "部署の保存中にエラーが発生しました",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームの初期化
  const initializeForm = (department?: Department) => {
    if (department) {
      setFormData({
        id: department.id,
        name: department.name,
        description: department.description || "",
        companyId: department.companyId,
      });
      setCurrentDepartment(department);
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        companyId: selectedCompany || "",
      });
      setCurrentDepartment(null);
    }
  };

  // フォーム入力の処理
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 検索でフィルタリングされた部署
  const filteredDepartments = departments.filter((department) => {
    // 会社フィルターの適用
    const companyFilter = selectedCompany === "all" || department.companyId === selectedCompany;
    
    // 検索語句フィルターの適用
    const searchFilter = 
      searchTerm === "" ||
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (department.description &&
        department.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (department.company?.name &&
        department.company.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()));
    
    return companyFilter && searchFilter;
  });

  // ローディング中の表示
  if (isLoading && departments.length === 0) {
    return <DepartmentsSkeleton />;
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
          <h1 className="text-2xl font-bold text-gray-900">部署管理</h1>
        </div>

        {/* 検索と新規作成 */}
        <Card>
          <CardHeader>
            <CardTitle>部署検索</CardTitle>
            <CardDescription>
              部署名、説明、会社名で検索できます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="部署を検索..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus={false}
                />
              </div>
              <Select
                value={selectedCompany}
                onValueChange={setSelectedCompany}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="会社で絞り込み" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべての会社</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                    disabled={selectedCompany === "all" || !hasPermission("department:create")}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    新規部署作成
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
                      {formData.id ? "部署の編集" : "新規部署の作成"}
                    </DialogTitle>
                    <DialogDescription>
                      部署情報を入力してください
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          部署名
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
                        <Textarea
                          id="description"
                          name="description"
                          value={formData.description || ""}
                          onChange={handleChange}
                          className="col-span-3"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="companyId" className="text-right">
                          会社
                        </Label>
                        <Select
                          name="companyId"
                          value={formData.companyId}
                          onValueChange={(value) => {
                            setFormData({
                              ...formData,
                              companyId: value,
                            });
                          }}
                          disabled={!!formData.id} // 編集時は会社を変更できない
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="会社を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {companies.map((company) => (
                              <SelectItem key={company.id} value={company.id}>
                                {company.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "保存中..." : "保存"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* 部署一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>部署一覧</CardTitle>
            <CardDescription>
              システムに登録されている部署の一覧です
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 animate-pulse rounded-md" />
                <div className="h-8 bg-gray-200 animate-pulse rounded-md" />
                <div className="h-8 bg-gray-200 animate-pulse rounded-md" />
              </div>
            ) : filteredDepartments.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm || selectedCompany !== "all"
                  ? "検索条件に一致する部署が見つかりませんでした"
                  : "部署が登録されていません"}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>部署名</TableHead>
                      <TableHead>説明</TableHead>
                      <TableHead>会社</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDepartments.map((department) => (
                      <TableRow key={department.id}>
                        <TableCell className="font-medium">
                          {department.name}
                        </TableCell>
                        <TableCell>
                          {department.description || "-"}
                        </TableCell>
                        <TableCell>
                          {department.company?.name || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                initializeForm(department);
                                setIsDialogOpen(true);
                              }}
                              disabled={!hasPermission("department:update")}
                            >
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">編集</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setCurrentDepartment(department);
                                setIsDeleteDialogOpen(true);
                              }}
                              disabled={!hasPermission("department:delete")}
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
              <DialogTitle>部署の削除</DialogTitle>
              <DialogDescription>
                この部署を削除してもよろしいですか？この操作は元に戻せません。
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700">
                部署名: <span className="font-medium">{currentDepartment?.name}</span>
              </p>
              <p className="text-sm text-gray-700">
                会社名: <span className="font-medium">{currentDepartment?.company?.name}</span>
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
