"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { PageTransition } from "@/components/animations/PageTransition";

/**
 * アプリページ用のスケルトンローディングコンポーネント
 */
export function AppSkeleton() {
  return (
    <PageTransition>
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
    </PageTransition>
  );
} 