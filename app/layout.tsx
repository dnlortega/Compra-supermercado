import type { Metadata, Viewport } from "next";
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
import { SessionProvider } from "@/components/session-provider";
import { UserButton } from "@/components/user-button";
import { InstallPrompt } from "@/components/install-prompt";

export const metadata: Metadata = {
  title: "Compra Supermercado - Gerenciador de Listas de Compras",
  description: "App inteligente para controle de compras de supermercado. Organize suas listas, acompanhe gastos e compartilhe com a família.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Compras",
  },
  openGraph: {
    title: "Compra Supermercado",
    description: "Gerenciador inteligente de listas de compras",
    type: "website",
    locale: "pt_BR",
    siteName: "Compra Supermercado",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compra Supermercado",
    description: "Gerenciador inteligente de listas de compras",
  },
  icons: {
    icon: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/logo.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#4285F4",
};

import { auth } from "@/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const hideNav = !session;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              {!hideNav && (
                <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <div className="container flex h-14 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
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
                      <div className="w-px h-6 bg-border mx-1" /> {/* Divisor sutil */}
                      <UserButton />
                    </div>
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
              )}
              <main className={`flex-1 ${!hideNav ? "pb-20" : ""}`}>
                {children}
              </main>
              {!hideNav && <BottomNav />}
            </div>
            <Toaster position="top-center" richColors />
            <InstallPrompt />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
