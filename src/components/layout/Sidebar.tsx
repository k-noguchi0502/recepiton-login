"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { hasPermission } from "@/lib/auth-utils";
import { NavItem } from "@/types";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home, PanelLeft, Users, Shield, Grid, Building, Briefcase, FileText } from "lucide-react";

interface SidebarProps {
  className?: string;
}

/**
 * ナビゲーション項目の定義
 * アプリケーションのナビゲーション構造を定義します
 */
const navigation: NavItem[] = [
  {
    name: "ダッシュボード",
    href: "/dashboard",
    icon: <Home className="h-5 w-5" />,
  },
  {
    name: "アプリ一覧",
    href: "/dashboard/app-list",
    icon: <Grid className="h-5 w-5" />,
  },
  {
    name: "ユーザー管理",
    href: "/dashboard/users",
    icon: <Users className="h-5 w-5" />,
    requiredPermissions: ["user:read"],
  },
  {
    name: "会社管理",
    href: "/dashboard/companies",
    icon: <Building className="h-5 w-5" />,
    requiredPermissions: ["company:read"],
  },
  {
    name: "部署管理",
    href: "/dashboard/departments",
    icon: <Briefcase className="h-5 w-5" />,
    requiredPermissions: ["department:read"],
  },
  {
    name: "ロール管理",
    href: "/dashboard/roles",
    icon: <Shield className="h-5 w-5" />,
    requiredPermissions: ["role:read"],
  },
  {
    name: "ドキュメント",
    href: "/dashboard/documentation",
    icon: <FileText className="h-5 w-5" />,
  },
];

/**
 * サイドバーコンポーネント
 * アプリケーションのナビゲーションを提供します
 */
export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { toggleSidebar, state } = useSidebar();
  const { data: session } = useSession();

  // 共通のボタンスタイル
  const buttonBaseClass =
    "w-full rounded-md transition-colors flex items-center p-0 h-8 justify-start";
  const buttonActiveClass = "bg-sidebar-accent text-sidebar-accent-foreground";
  const buttonInactiveClass =
    "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground";

  // アイコンとテキストのコンテナスタイル
  const iconContainerClass =
    "flex-none w-8 h-8 flex items-center justify-center";
  const textContainerClass =
    "ml-2 flex-grow h-8 flex items-center data-[collapsed=true]:hidden";

  // ユーザーの権限に基づいてフィルタリングされたナビゲーション項目
  const filteredNavigation = navigation.filter(item => 
    hasPermission(session?.user?.role?.permissions, item.requiredPermissions)
  );

  return (
    <ShadcnSidebar
      className={cn("h-full border-r bg-sidebar", className)}
      variant="sidebar"
      side="left"
      collapsible="icon"
    >
      {/* ヘッダー */}
      <SidebarHeader className="h-[47px] p-2 border-b border-sidebar-border flex items-center">
        <div className="w-full">
          <Button
            variant="ghost"
            className={cn(
              buttonBaseClass,
              "data-[collapsed=true]:justify-center"
            )}
            onClick={toggleSidebar}
          >
            <div className={iconContainerClass}>
              <PanelLeft className={cn(
                "h-5 w-5 transition-transform duration-200",
                state === "collapsed" && "rotate-180"
              )} />
            </div>
            <div className={textContainerClass} data-collapsed={state === "collapsed"}>
              <span>メニュー</span>
            </div>
          </Button>
        </div>
      </SidebarHeader>

      {/* メインナビゲーション */}
      <SidebarContent className="p-2 overflow-hidden">
        <SidebarMenu>
          {filteredNavigation.map((item) => (
            <SidebarMenuItem key={item.name} className="mb-1">
              <Button
                asChild
                variant="ghost"
                className={cn(
                  buttonBaseClass,
                  "data-[collapsed=true]:justify-center",
                  pathname === item.href
                    ? buttonActiveClass
                    : buttonInactiveClass
                )}
              >
                <Link href={item.href} className="flex w-full">
                  <div className={iconContainerClass}>{item.icon}</div>
                  <div className={textContainerClass} data-collapsed={state === "collapsed"}>
                    <span>{item.name}</span>
                  </div>
                </Link>
              </Button>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* サイドバーレール（閉じた状態でのガイド） */}
      <SidebarRail />
    </ShadcnSidebar>
  );
}
