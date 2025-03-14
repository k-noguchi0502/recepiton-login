import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ClientProviders } from "@/components/ClientProviders";

// Noto Sans JPフォントを追加
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  display: "swap",
  preload: true,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOCH-HUB",
  description: "TOCH-HUB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning className={`${notoSansJP.className} light`}>
      <head>
        <meta name="viewport" content="viewport-fit=cover" />
      </head>
      <body
        className={`${notoSansJP.variable} ${notoSansJP.className} ${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
        <Toaster />
      </body>
    </html>
  );
}

