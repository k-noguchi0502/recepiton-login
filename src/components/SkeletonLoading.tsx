"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

/**
 * ダッシュボードページ用のスケルトンローディングコンポーネント
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* ユーザー情報カードのスケルトン */}
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Skeleton className="h-4 w-1/5 mb-1" />
              <Skeleton className="h-5 w-3/5" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/5 mb-1" />
              <Skeleton className="h-5 w-4/5" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/5 mb-1" />
              <Skeleton className="h-5 w-2/5" />
            </div>
            <div>
              <Skeleton className="h-4 w-1/5 mb-1" />
              <Skeleton className="h-5 w-3/5" />
            </div>
            <div className="sm:col-span-2">
              <Skeleton className="h-4 w-1/5 mb-1" />
              <div className="flex flex-wrap gap-1 mt-1">
                {Array(5).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-5 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アプリケーション一覧のスケルトン */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-2/5 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-1/2" />
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-4/5 mb-4" />
                  <div className="flex flex-wrap gap-1">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-12 rounded-full" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * ユーザー管理ページ用のスケルトンローディングコンポーネント
 */
export function UsersSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="space-y-6">
        {/* 検索と新規作成ボタンのスケルトン */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-1/2 max-w-md">
                <div className="relative">
                  <div className="absolute left-2.5 top-2.5 h-4 w-4 bg-gray-300 rounded-full"></div>
                  <Skeleton className="h-9 w-full pl-8" />
                </div>
              </div>
              <Skeleton className="h-9 w-full sm:w-40" />
            </div>
          </CardContent>
        </Card>

        {/* ユーザー一覧テーブルのスケルトン */}
        <Card className="flex flex-col h-[calc(100vh-25rem)]">
          <CardHeader className="flex-none">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-auto h-full">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="bg-white border-b"><Skeleton className="h-5 w-1/2" /></TableHead>
                    <TableHead className="bg-white border-b"><Skeleton className="h-5 w-1/2" /></TableHead>
                    <TableHead className="bg-white border-b"><Skeleton className="h-5 w-1/2" /></TableHead>
                    <TableHead className="text-right bg-white border-b"><Skeleton className="h-5 w-1/4 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-4/5" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-1/2" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * ロール管理ページ用のスケルトンローディングコンポーネント
 */
export function RolesSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="space-y-6">
        {/* 検索と新規作成ボタンのスケルトン */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-1/2 max-w-md">
                <div className="relative">
                  <div className="absolute left-2.5 top-2.5 h-4 w-4 bg-gray-300 rounded-full"></div>
                  <Skeleton className="h-9 w-full pl-8" />
                </div>
              </div>
              <Skeleton className="h-9 w-full sm:w-40" />
            </div>
          </CardContent>
        </Card>

        {/* ロール一覧テーブルのスケルトン */}
        <Card className="flex flex-col h-[calc(100vh-25rem)]">
          <CardHeader className="flex-none">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-auto h-full">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="bg-white border-b"><Skeleton className="h-5 w-1/2" /></TableHead>
                    <TableHead className="bg-white border-b"><Skeleton className="h-5 w-1/2" /></TableHead>
                    <TableHead className="bg-white border-b"><Skeleton className="h-5 w-1/2" /></TableHead>
                    <TableHead className="text-right bg-white border-b"><Skeleton className="h-5 w-1/4 ml-auto" /></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5).fill(0).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-3/4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-4/5" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-1/4" /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * アプリ一覧ページ用のスケルトンローディングコンポーネント
 */
export function AppListSkeleton() {
  return (
    <div className="overflow-hidden">
      <div className="space-y-6">
        {/* 検索機能のスケルトン */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div className="relative w-full sm:w-1/2 max-w-md">
                <div className="relative">
                  <div className="absolute left-2.5 top-2.5 h-4 w-4 bg-gray-300 rounded-full"></div>
                  <Skeleton className="h-9 w-full pl-8" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* アプリケーション一覧のスケルトン */}
        <Card className="flex flex-col h-[calc(100vh-25rem)]">
          <CardHeader className="flex-none">
            <Skeleton className="h-6 w-1/4 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden">
            <div className="overflow-auto h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center space-x-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-4/5 mb-4" />
                      <div className="flex flex-wrap gap-1">
                        <Skeleton className="h-5 w-16 rounded-full" />
                        <Skeleton className="h-5 w-12 rounded-full" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * アプリページ用のスケルトンローディングコンポーネント
 */
export function AppSkeleton() {
  return (
    <div className="container mx-auto py-10 relative">
      <Card className="w-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-1/4 mb-2" />
          <Skeleton className="h-4 w-1/3" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <div className="pt-4">
              <Skeleton className="h-10 w-full max-w-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 