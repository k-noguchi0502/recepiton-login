"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useState } from "react";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // サーバーサイドレンダリング時にはchildrenをそのまま返す
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
} 