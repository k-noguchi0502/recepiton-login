"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 sm:px-6 pb-6 space-y-6 max-w-[1200px] overflow-x-hidden">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">システム仕様書</h1>
        <p className="text-muted-foreground">
          このシステムの仕様、ER図、技術スタックに関する情報です。
        </p>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 w-full md:w-[600px] gap-1">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="er-diagram">ER図</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="screens">画面構成</TabsTrigger>
          <TabsTrigger value="tech-stack">技術スタック</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 overflow-x-hidden">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>システム概要</CardTitle>
              <CardDescription>このシステムの主な機能と目的</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <p>
                このシステムは、Next.jsとPrismaを使用した管理者向けのログイン・認証システムです。
                ユーザーは権限に基づいて様々なアプリケーションにアクセスできるポータルサイトとなっています。
              </p>
              
              <h3 className="text-lg font-semibold mt-4">主な機能</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>ユーザー認証（ログイン/ログアウト）</li>
                <li>ロールベースのアクセス制御（RBAC）</li>
                <li>ユーザー管理（作成、閲覧、更新、削除）</li>
                <li>ロール管理（作成、閲覧、更新、削除）</li>
                <li>会社管理（作成、閲覧、更新、削除）</li>
                <li>部署管理（作成、閲覧、更新、削除）</li>
                <li>アプリケーションポータル（権限に基づいたアプリケーション一覧表示）</li>
                <li>アプリケーションごとの戻るボタン制御（ブラウザの戻る操作の許可/禁止）</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>権限システム</CardTitle>
              <CardDescription>ロールベースのアクセス制御</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <p>
                システムは以下の権限を持つロールベースのアクセス制御を実装しています：
              </p>
              
              <h3 className="text-lg font-semibold mt-4">権限一覧</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>user:create - ユーザー作成権限</li>
                <li>user:read - ユーザー閲覧権限</li>
                <li>user:update - ユーザー更新権限</li>
                <li>user:delete - ユーザー削除権限</li>
                <li>role:create - ロール作成権限</li>
                <li>role:read - ロール閲覧権限</li>
                <li>role:update - ロール更新権限</li>
                <li>role:delete - ロール削除権限</li>
                <li>company:create - 会社作成権限</li>
                <li>company:read - 会社閲覧権限</li>
                <li>company:update - 会社更新権限</li>
                <li>company:delete - 会社削除権限</li>
                <li>department:create - 部署作成権限</li>
                <li>department:read - 部署閲覧権限</li>
                <li>department:update - 部署更新権限</li>
                <li>department:delete - 部署削除権限</li>
                <li>page:demo1 - デモ1アプリケーションアクセス権限</li>
                <li>page:demo2 - デモ2アプリケーションアクセス権限</li>
              </ul>

              <h3 className="text-lg font-semibold mt-4">デフォルトロール</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">admin（管理者）</span>
                  <p className="text-sm text-muted-foreground">すべての権限を持つ</p>
                </li>
                <li>
                  <span className="font-medium">user（一般ユーザー）</span>
                  <p className="text-sm text-muted-foreground">user:read, company:read, department:read のみ</p>
                </li>
                <li>
                  <span className="font-medium">viewer（閲覧者）</span>
                  <p className="text-sm text-muted-foreground">user:read, company:read, department:read のみ</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="er-diagram" className="space-y-4 overflow-x-hidden">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>ER図</CardTitle>
              <CardDescription>データベースの構造</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <div className="overflow-x-auto">
                <div className="p-2 sm:p-4 bg-white rounded-md border">
                  <svg 
                    width="100%" 
                    height="auto" 
                    viewBox="0 0 850 500" 
                    className="mx-auto"
                    preserveAspectRatio="xMidYMid meet"
                    style={{ maxWidth: '100%', height: 'auto', minHeight: '300px' }}
                  >
                    {/* テーブル: Role */}
                    <g>
                      <rect x="30" y="50" width="180" height="180" rx="4" fill="#f0f9ff" stroke="#0284c7" strokeWidth="2" />
                      
                      {/* ヘッダー */}
                      <rect x="30" y="50" width="180" height="30" rx="4" fill="#0284c7" />
                      <text x="120" y="70" textAnchor="middle" fontSize="14" fill="white">Role</text>
                      
                      {/* フィールド */}
                      <text x="50" y="100" fontSize="12" fill="#334155">id (PK)</text>
                      <text x="50" y="120" fontSize="12" fill="#334155">name</text>
                      <text x="50" y="140" fontSize="12" fill="#334155">description</text>
                      <text x="50" y="160" fontSize="12" fill="#334155">permissions</text>
                      <text x="50" y="180" fontSize="12" fill="#334155">createdAt</text>
                      <text x="50" y="200" fontSize="12" fill="#334155">updatedAt</text>
                    </g>
                    
                    {/* テーブル: User */}
                    <g>
                      <rect x="320" y="50" width="180" height="220" rx="4" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
                      
                      {/* ヘッダー */}
                      <rect x="320" y="50" width="180" height="30" rx="4" fill="#16a34a" />
                      <text x="410" y="70" textAnchor="middle" fontSize="14" fill="white">User</text>
                      
                      {/* フィールド */}
                      <text x="340" y="100" fontSize="12" fill="#334155">id (PK)</text>
                      <text x="340" y="120" fontSize="12" fill="#334155">name</text>
                      <text x="340" y="140" fontSize="12" fill="#334155">email</text>
                      <text x="340" y="160" fontSize="12" fill="#334155">password</text>
                      <text x="340" y="180" fontSize="12" fill="#334155">image</text>
                      <text x="340" y="200" fontSize="12" fill="#334155">roleId (FK)</text>
                      <text x="340" y="220" fontSize="12" fill="#334155">departmentId (FK)</text>
                      <text x="340" y="240" fontSize="12" fill="#334155">createdAt</text>
                      <text x="340" y="260" fontSize="12" fill="#334155">updatedAt</text>
                    </g>
                    
                    {/* テーブル: Department */}
                    <g>
                      <rect x="320" y="320" width="180" height="140" rx="4" fill="#fef3c7" stroke="#d97706" strokeWidth="2" />
                      
                      {/* ヘッダー */}
                      <rect x="320" y="320" width="180" height="30" rx="4" fill="#d97706" />
                      <text x="410" y="340" textAnchor="middle" fontSize="14" fill="white">Department</text>
                      
                      {/* フィールド */}
                      <text x="340" y="370" fontSize="12" fill="#334155">id (PK)</text>
                      <text x="340" y="390" fontSize="12" fill="#334155">name</text>
                      <text x="340" y="410" fontSize="12" fill="#334155">description</text>
                      <text x="340" y="430" fontSize="12" fill="#334155">companyId (FK)</text>
                      <text x="340" y="450" fontSize="12" fill="#334155">createdAt</text>
                    </g>
                    
                    {/* テーブル: Company */}
                    <g>
                      <rect x="610" y="320" width="180" height="180" rx="4" fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
                      
                      {/* ヘッダー */}
                      <rect x="610" y="320" width="180" height="30" rx="4" fill="#dc2626" />
                      <text x="700" y="340" textAnchor="middle" fontSize="14" fill="white">Company</text>
                      
                      {/* フィールド */}
                      <text x="630" y="370" fontSize="12" fill="#334155">id (PK)</text>
                      <text x="630" y="390" fontSize="12" fill="#334155">name</text>
                      <text x="630" y="410" fontSize="12" fill="#334155">description</text>
                      <text x="630" y="430" fontSize="12" fill="#334155">address</text>
                      <text x="630" y="450" fontSize="12" fill="#334155">phone</text>
                      <text x="630" y="470" fontSize="12" fill="#334155">email</text>
                      <text x="630" y="490" fontSize="12" fill="#334155">website</text>
                    </g>
                    
                    {/* リレーションシップ: Role -> User (1:N) */}
                    <g>
                      <path d="M 210 140 L 320 200" stroke="#0284c7" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                      <text x="260" y="160" fontSize="12" fill="#0284c7">1:N</text>
                    </g>
                    
                    {/* リレーションシップ: Department -> User (1:N) */}
                    <g>
                      <path d="M 410 320 L 410 270" stroke="#d97706" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                      <text x="420" y="300" fontSize="12" fill="#d97706">1:N</text>
                    </g>
                    
                    {/* リレーションシップ: Company -> Department (1:N) */}
                    <g>
                      <path d="M 610 390 L 500 390" stroke="#dc2626" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)" />
                      <text x="550" y="380" fontSize="12" fill="#dc2626">1:N</text>
                    </g>
                    
                    {/* 矢印の定義 */}
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                      </marker>
                    </defs>
                  </svg>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#0284c7] rounded-sm mr-1"></div>
                    <span className="text-sm">Role</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#16a34a] rounded-sm mr-1"></div>
                    <span className="text-sm">User</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#d97706] rounded-sm mr-1"></div>
                    <span className="text-sm">Department</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-[#dc2626] rounded-sm mr-1"></div>
                    <span className="text-sm">Company</span>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-4">テーブル構成</h3>
              
              <div className="space-y-6">
                <div className="border rounded-md">
                  <h4 className="font-medium p-3 bg-muted/30">Roleテーブル</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">フィールド名</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">データ型</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm">id</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">主キー、CUID形式</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">name</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">ロール名（一意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">description</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">ロールの説明（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">permissions</td>
                          <td className="px-4 py-2 text-sm">String[]</td>
                          <td className="px-4 py-2 text-sm">権限のリスト</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">createdAt</td>
                          <td className="px-4 py-2 text-sm">DateTime</td>
                          <td className="px-4 py-2 text-sm">作成日時</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">updatedAt</td>
                          <td className="px-4 py-2 text-sm">DateTime</td>
                          <td className="px-4 py-2 text-sm">更新日時</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border rounded-md">
                  <h4 className="font-medium p-3 bg-muted/30">Userテーブル</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">フィールド名</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">データ型</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm">id</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">主キー、CUID形式</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">name</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">ユーザー名（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">email</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">メールアドレス（一意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">password</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">ハッシュ化されたパスワード</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">image</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">プロフィール画像URL（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">roleId</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">外部キー（Roleテーブルへの参照）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">departmentId</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">外部キー（Departmentテーブルへの参照）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">createdAt</td>
                          <td className="px-4 py-2 text-sm">DateTime</td>
                          <td className="px-4 py-2 text-sm">作成日時</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">updatedAt</td>
                          <td className="px-4 py-2 text-sm">DateTime</td>
                          <td className="px-4 py-2 text-sm">更新日時</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <h4 className="font-medium p-3 bg-muted/30">Companyテーブル</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">フィールド名</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">データ型</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm">id</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">主キー、CUID形式</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">name</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">会社名（一意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">description</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">会社の説明（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">address</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">会社の住所（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">phone</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">会社の電話番号（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">email</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">会社のメールアドレス（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">website</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">会社のWebサイトURL（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">createdAt</td>
                          <td className="px-4 py-2 text-sm">DateTime</td>
                          <td className="px-4 py-2 text-sm">作成日時</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">updatedAt</td>
                          <td className="px-4 py-2 text-sm">DateTime</td>
                          <td className="px-4 py-2 text-sm">更新日時</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border rounded-md">
                  <h4 className="font-medium p-3 bg-muted/30">Departmentテーブル</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">フィールド名</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">データ型</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm">id</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">主キー、CUID形式</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">name</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">部署名（会社内で一意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">description</td>
                          <td className="px-4 py-2 text-sm">String?</td>
                          <td className="px-4 py-2 text-sm">部署の説明（任意）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">companyId</td>
                          <td className="px-4 py-2 text-sm">String</td>
                          <td className="px-4 py-2 text-sm">外部キー（Companyテーブルへの参照）</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm">createdAt</td>
                          <td className="px-4 py-2 text-sm">DateTime</td>
                          <td className="px-4 py-2 text-sm">作成日時</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech-stack" className="space-y-4 overflow-x-hidden">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>技術スタック</CardTitle>
              <CardDescription>使用している技術とライブラリ</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">フロントエンド</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Next.js (App Router)</span>
                        <p className="text-sm text-muted-foreground">Reactフレームワーク</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">React</span>
                        <p className="text-sm text-muted-foreground">UIライブラリ</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">TypeScript</span>
                        <p className="text-sm text-muted-foreground">型安全な開発</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Tailwind CSS</span>
                        <p className="text-sm text-muted-foreground">ユーティリティファーストのCSSフレームワーク</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">shadcn/ui</span>
                        <p className="text-sm text-muted-foreground">UIコンポーネントライブラリ</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Framer Motion</span>
                        <p className="text-sm text-muted-foreground">アニメーションライブラリ</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">バックエンド</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Next.js API Routes</span>
                        <p className="text-sm text-muted-foreground">サーバーサイドAPI</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">Prisma ORM</span>
                        <p className="text-sm text-muted-foreground">データベースORM</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">NextAuth.js</span>
                        <p className="text-sm text-muted-foreground">認証ライブラリ</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">bcrypt</span>
                        <p className="text-sm text-muted-foreground">パスワードハッシュ化</p>
                      </div>
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold mt-6">データベース</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <div>
                        <span className="font-medium">PostgreSQL</span>
                        <p className="text-sm text-muted-foreground">リレーショナルデータベース</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6">システムの特徴</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">セキュアな認証システム</span>
                    <p className="text-sm text-muted-foreground">NextAuthを使用したJWTベースの認証、bcryptでハッシュ化されたパスワード</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">柔軟な権限管理</span>
                    <p className="text-sm text-muted-foreground">ロールベースのアクセス制御、細かい粒度の権限設定</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">モダンなUI/UX</span>
                    <p className="text-sm text-muted-foreground">レスポンシブデザイン、アニメーション効果、ダークモード対応</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5 h-5 w-5 flex-shrink-0 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">拡張性の高いアーキテクチャ</span>
                    <p className="text-sm text-muted-foreground">Next.jsのApp Router、Prisma ORM、型安全なTypeScriptコード</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4 overflow-x-hidden">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>API仕様</CardTitle>
              <CardDescription>システムで利用可能なAPIエンドポイント</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 overflow-hidden">
              <div>
                <h3 className="text-lg font-semibold">認証API</h3>
                <div className="border rounded-md mt-2">
                  <h4 className="font-medium p-3 bg-muted/30">エンドポイント一覧</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">エンドポイント</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">メソッド</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/auth/signin</td>
                          <td className="px-4 py-2 text-sm">POST</td>
                          <td className="px-4 py-2 text-sm">ユーザーログイン</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/auth/signout</td>
                          <td className="px-4 py-2 text-sm">POST</td>
                          <td className="px-4 py-2 text-sm">ユーザーログアウト</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/auth/session</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">現在のセッション情報取得</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">ユーザーAPI</h3>
                <div className="border rounded-md mt-2">
                  <h4 className="font-medium p-3 bg-muted/30">エンドポイント一覧</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">エンドポイント</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">メソッド</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/users</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">全ユーザー一覧取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/users</td>
                          <td className="px-4 py-2 text-sm">POST</td>
                          <td className="px-4 py-2 text-sm">新規ユーザー作成</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/users/:id</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">特定ユーザー情報取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/users/:id</td>
                          <td className="px-4 py-2 text-sm">PUT</td>
                          <td className="px-4 py-2 text-sm">ユーザー情報更新</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/users/:id</td>
                          <td className="px-4 py-2 text-sm">DELETE</td>
                          <td className="px-4 py-2 text-sm">ユーザー削除</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">ロールAPI</h3>
                <div className="border rounded-md mt-2">
                  <h4 className="font-medium p-3 bg-muted/30">エンドポイント一覧</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">エンドポイント</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">メソッド</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/roles</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">全ロール一覧取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/roles</td>
                          <td className="px-4 py-2 text-sm">POST</td>
                          <td className="px-4 py-2 text-sm">新規ロール作成</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/roles/:id</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">特定ロール情報取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/roles/:id</td>
                          <td className="px-4 py-2 text-sm">PUT</td>
                          <td className="px-4 py-2 text-sm">ロール情報更新</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/roles/:id</td>
                          <td className="px-4 py-2 text-sm">DELETE</td>
                          <td className="px-4 py-2 text-sm">ロール削除</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">会社・部署API</h3>
                <div className="border rounded-md mt-2">
                  <h4 className="font-medium p-3 bg-muted/30">エンドポイント一覧</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">エンドポイント</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">メソッド</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">説明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/companies</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">全会社一覧取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/companies</td>
                          <td className="px-4 py-2 text-sm">POST</td>
                          <td className="px-4 py-2 text-sm">新規会社作成</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/companies/:id</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">特定会社情報取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/companies/:id</td>
                          <td className="px-4 py-2 text-sm">PUT</td>
                          <td className="px-4 py-2 text-sm">会社情報更新</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/companies/:id</td>
                          <td className="px-4 py-2 text-sm">DELETE</td>
                          <td className="px-4 py-2 text-sm">会社削除</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/companies/:id/departments</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">特定会社の部署一覧取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/departments</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">全部署一覧取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/departments</td>
                          <td className="px-4 py-2 text-sm">POST</td>
                          <td className="px-4 py-2 text-sm">新規部署作成</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/departments/:id</td>
                          <td className="px-4 py-2 text-sm">GET</td>
                          <td className="px-4 py-2 text-sm">特定部署情報取得</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/departments/:id</td>
                          <td className="px-4 py-2 text-sm">PUT</td>
                          <td className="px-4 py-2 text-sm">部署情報更新</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 text-sm font-mono">/api/departments/:id</td>
                          <td className="px-4 py-2 text-sm">DELETE</td>
                          <td className="px-4 py-2 text-sm">部署削除</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screens" className="space-y-4 overflow-x-hidden">
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>画面構成</CardTitle>
              <CardDescription>システムの主要画面と機能</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 overflow-hidden">
              <div>
                <h3 className="text-lg font-semibold">認証画面</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">ログイン画面</h4>
                    <p className="text-sm text-muted-foreground mb-2">ユーザーがシステムにログインするための画面</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>メールアドレスとパスワードによる認証</li>
                      <li>ログイン状態の保持機能</li>
                      <li>エラーメッセージの表示</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">ダッシュボード</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">メインダッシュボード</h4>
                    <p className="text-sm text-muted-foreground mb-2">ログイン後の最初の画面</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>ユーザー情報の表示</li>
                      <li>アクセス可能なアプリケーション一覧</li>
                      <li>最近のアクティビティ</li>
                    </ul>
                  </div>
                  <div className="border rounded-md p-4">
                    <h4 className="font-medium mb-2">アプリケーションポータル</h4>
                    <p className="text-sm text-muted-foreground mb-2">利用可能なアプリケーション一覧</p>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>権限に基づいたアプリケーション表示</li>
                      <li>アプリケーションの説明と機能概要</li>
                      <li>アプリケーションへのクイックアクセス</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">管理画面</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-3 sm:p-4">
                    <h4 className="font-medium mb-2">ユーザー管理</h4>
                    <p className="text-sm text-muted-foreground mb-2">ユーザーの作成・編集・削除を行う画面</p>
                    <ul className="list-disc pl-4 sm:pl-5 text-sm space-y-1">
                      <li>ユーザー一覧表示と検索機能</li>
                      <li>ユーザー詳細情報の編集</li>
                      <li>ロールの割り当て</li>
                      <li>部署の割り当て</li>
                    </ul>
                  </div>
                  <div className="border rounded-md p-3 sm:p-4">
                    <h4 className="font-medium mb-2">ロール管理</h4>
                    <p className="text-sm text-muted-foreground mb-2">ロールの作成・編集・削除を行う画面</p>
                    <ul className="list-disc pl-4 sm:pl-5 text-sm space-y-1">
                      <li>ロール一覧表示と検索機能</li>
                      <li>権限の設定</li>
                      <li>ロールの詳細情報編集</li>
                    </ul>
                  </div>
                  <div className="border rounded-md p-3 sm:p-4">
                    <h4 className="font-medium mb-2">会社管理</h4>
                    <p className="text-sm text-muted-foreground mb-2">会社情報の作成・編集・削除を行う画面</p>
                    <ul className="list-disc pl-4 sm:pl-5 text-sm space-y-1">
                      <li>会社一覧表示と検索機能</li>
                      <li>会社詳細情報の編集</li>
                      <li>会社に関連する部署の管理</li>
                    </ul>
                  </div>
                  <div className="border rounded-md p-3 sm:p-4">
                    <h4 className="font-medium mb-2">部署管理</h4>
                    <p className="text-sm text-muted-foreground mb-2">部署情報の作成・編集・削除を行う画面</p>
                    <ul className="list-disc pl-4 sm:pl-5 text-sm space-y-1">
                      <li>部署一覧表示と検索機能</li>
                      <li>部署詳細情報の編集</li>
                      <li>会社ごとの部署フィルタリング</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">デモアプリケーション</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div className="border rounded-md p-3 sm:p-4">
                    <h4 className="font-medium mb-2">デモ1アプリケーション</h4>
                    <p className="text-sm text-muted-foreground mb-2">ブラウザの戻るボタンが有効なデモアプリ</p>
                    <ul className="list-disc pl-4 sm:pl-5 text-sm space-y-1">
                      <li>通常のブラウザナビゲーション</li>
                      <li>シンプルなデモ機能</li>
                    </ul>
                  </div>
                  <div className="border rounded-md p-3 sm:p-4">
                    <h4 className="font-medium mb-2">デモ2アプリケーション</h4>
                    <p className="text-sm text-muted-foreground mb-2">ブラウザの戻るボタンが無効なデモアプリ</p>
                    <ul className="list-disc pl-4 sm:pl-5 text-sm space-y-1">
                      <li>ブラウザの戻るボタンが無効化</li>
                      <li>アプリ内ナビゲーションのみ許可</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 