"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, Receipt, PieChart, History as HistoryIcon, BookOpen } from "lucide-react"

import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()

    const items = [
        {
            href: "/",
            label: "Início",
            icon: Home,
        },
        {
            href: "/list",
            label: "Lista",
            icon: List,
        },
        {
            href: "/prices",
            label: "Compras",
            icon: Receipt,
        },
        {
            href: "/summary",
            label: "Resumo",
            icon: PieChart,
        },
        {
            href: "/history",
            label: "Histórico",
            icon: HistoryIcon,
        },
        {
            href: "/about",
            label: "Sobre",
            icon: BookOpen,
        },
    ]

    return (
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-md z-50 pb-safe">
            <nav className="flex items-center justify-around h-16">
                {items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors",
                                isActive
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground hover:text-primary/70"
                            )}
                        >
                            <Icon className="size-6" />
                            <span className="text-[10px]">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
