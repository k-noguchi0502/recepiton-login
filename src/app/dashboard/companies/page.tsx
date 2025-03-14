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
import { motion } from "framer-motion";
import { CompaniesSkeleton } from "@/components/SkeletonLoading";
import { toast } from "sonner";
import { Company, CompanyFormData } from "@/types";

export default function CompaniesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<CompanyFormData>({
    id: "",
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  // 認証チェック
  useEffect(() => {
    if (status === "unauthenticated") {
      // 直接リダイレクトして履歴をリセット
      window.location.replace("/login");
    } else if (
      status === "authenticated" &&
      (!session.user.role || !session.user.role.permissions.includes("company:read"))
    ) {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // 会社一覧の取得
  useEffect(() => {
    if (status === "authenticated") {
      fetchCompanies();
    }
  }, [status]);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  // 会社の削除
  const handleDelete = async () => {
    if (!currentCompany) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/companies/${currentCompany.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "会社の削除に失敗しました");
      }

      toast.success("削除完了", {
        description: `会社「${currentCompany.name}」が正常に削除されました`,
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("エラー", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("エラー", {
          description: "会社の削除中にエラーが発生しました",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 会社の作成/更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = formData.id ? `/api/companies/${formData.id}` : "/api/companies";
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
        throw new Error(data.error || "会社の保存に失敗しました");
      }

      if (formData.id) {
        toast.success("更新完了", {
          description: "会社が正常に更新されました",
          duration: 3000,
        });
      } else {
        toast.success("作成完了", {
          description: "会社が正常に作成されました",
          duration: 3000,
        });
      }
      
      setIsDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("エラー", {
          description: error.message,
          duration: 5000,
        });
      } else {
        toast.error("エラー", {
          description: "会社の保存中にエラーが発生しました",
          duration: 5000,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // フォームの初期化
  const initializeForm = (company?: Company) => {
    if (company) {
      setFormData({
        id: company.id,
        name: company.name,
        description: company.description || "",
        address: company.address || "",
        phone: company.phone || "",
        email: company.email || "",
        website: company.website || "",
      });
      setCurrentCompany(company);
    } else {
      setFormData({
        id: "",
        name: "",
        description: "",
        address: "",
        phone: "",
        email: "",
        website: "",
      });
      setCurrentCompany(null);
    }
  };

  // フォーム入力の処理
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 検索でフィルタリングされた会社
  const filteredCompanies = companies.filter((company) => {
    return (
      searchTerm === "" ||
      company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (company.description &&
        company.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.address &&
        company.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (company.email &&
        company.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      false
    );
  });

  // ローディング中の表示
  if (isLoading && companies.length === 0) {
    return <CompaniesSkeleton />;
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
        {/* 検索と新規作成 */}
        <Card>
          <CardHeader>
            <CardTitle>会社検索</CardTitle>
            <CardDescription>
              会社名や説明で検索できます
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-1/2 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="会社を検索..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    新規会社作成
                  </Button>
                </DialogTrigger>
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
                      {formData.id ? "会社の編集" : "新規会社の作成"}
                    </DialogTitle>
                    <DialogDescription>
                      会社情報を入力してください
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          会社名
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
                          value={formData.description}
                          onChange={handleChange}
                          className="col-span-3"
                          rows={3}
                          autoFocus={false}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          住所
                        </Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="col-span-3"
                          autoFocus={false}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          電話番号
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="col-span-3"
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
                          autoFocus={false}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="website" className="text-right">
                          Webサイト
                        </Label>
                        <Input
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="col-span-3"
                          autoFocus={false}
                        />
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

        {/* 会社一覧 */}
        <Card className="flex flex-col">
          <CardHeader className="flex-none">
            <CardTitle>会社一覧</CardTitle>
            <CardDescription>
              {filteredCompanies.length === 0
                ? "検索条件に一致する会社がありません"
                : `${filteredCompanies.length}件の会社が見つかりました`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-auto max-h-[calc(100vh-25rem)]">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="bg-white border-b">会社名</TableHead>
                    <TableHead className="bg-white border-b">説明</TableHead>
                    <TableHead className="bg-white border-b">住所</TableHead>
                    <TableHead className="bg-white border-b">連絡先</TableHead>
                    <TableHead className="text-right bg-white border-b">
                      操作
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        会社が見つかりません
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          {company.name}
                        </TableCell>
                        <TableCell>{company.description || "-"}</TableCell>
                        <TableCell>{company.address || "-"}</TableCell>
                        <TableCell>
                          {company.phone && <div>{company.phone}</div>}
                          {company.email && <div>{company.email}</div>}
                          {company.website && (
                            <div>
                              <a
                                href={
                                  company.website.startsWith("http")
                                    ? company.website
                                    : `https://${company.website}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {company.website}
                              </a>
                            </div>
                          )}
                          {!company.phone &&
                            !company.email &&
                            !company.website &&
                            "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                initializeForm(company);
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
                                setCurrentCompany(company);
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
        <Dialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <DialogContent
            className="sm:max-w-[425px]"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <DialogHeader>
              <DialogTitle>会社の削除</DialogTitle>
              <DialogDescription>
                この会社を削除してもよろしいですか？この操作は元に戻せません。
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700">
                会社名: <span className="font-medium">{currentCompany?.name}</span>
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
