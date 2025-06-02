import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "./QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLShare - URLマークダウン共有アプリ",
  description: "URLをマークダウン形式で簡単に共有できるアプリケーション",
  openGraph: {
    title: "LLShare - URLマークダウン共有アプリ",
    description: "URLをマークダウン形式で簡単に共有できるアプリケーション",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "LLShare - URLマークダウン共有アプリ",
    description: "URLをマークダウン形式で簡単に共有できるアプリケーション",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
