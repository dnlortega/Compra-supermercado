import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { BottomNav } from "@/components/bottom-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Controle de Supermercado",
  description: "App para controle de compras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
                  <div className="relative size-8 overflow-hidden rounded-lg border bg-white p-0.5 shadow-sm">
                    <Image
                      src="/logo.png"
                      alt="Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
                <div className="flex items-center gap-1">
                  <Link href="/about">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary transition-colors">
                      <Info className="h-5 w-5" />
                    </Button>
                  </Link>
                  <ThemeToggle />
                </div>
              </div>
            </header>
            <main className="flex-1 pb-20">
              {children}
            </main>
            <BottomNav />
          </div>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
