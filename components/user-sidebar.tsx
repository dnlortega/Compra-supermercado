"use client"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { LogOut, User, Settings, Users, TrendingUp } from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

interface UserSidebarProps {
    user: {
        name?: string | null
        email?: string | null
        image?: string | null
    }
    children: React.ReactNode
}

export function UserSidebar({ user, children }: UserSidebarProps) {
    const isAdmin = user.email === "dnlortega@gmail.com"

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] border-l rounded-l-2xl m-2 h-[calc(100vh-1rem)] shadow-2xl flex flex-col gap-6">
                <SheetHeader className="text-left space-y-4">
                    <SheetTitle>Perfil</SheetTitle>
                    <div className="flex items-center gap-4">
                        {user.image ? (
                            <div className="relative size-16 overflow-hidden rounded-full border-2 border-primary/20">
                                <Image
                                    src={user.image}
                                    alt={user.name || "User"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                <User className="h-8 w-8 text-primary" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-lg">{user.name}</p>
                            <p className="text-sm text-muted-foreground break-all">
                                {user.email}
                            </p>
                        </div>
                    </div>
                </SheetHeader>

                <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                    <Link href="/settings" className="w-full">
                        <Button variant="ghost" className="w-full justify-start h-12 text-base font-normal">
                            <Settings className="mr-3 h-5 w-5" />
                            Configurações
                        </Button>
                    </Link>

                    <Link href="/prices/price-history-admin" className="w-full">
                        <Button variant="ghost" className="w-full justify-start h-12 text-base font-normal">
                            <TrendingUp className="mr-3 h-5 w-5" />
                            Histórico de Preços
                        </Button>
                    </Link>

                    {isAdmin && (
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="admin" className="border-0">
                                <AccordionTrigger className="hover:no-underline py-2 px-4 rounded-md hover:bg-accent hover:text-accent-foreground text-base font-normal">
                                    <div className="flex items-center">
                                        <Users className="mr-3 h-5 w-5" />
                                        Administração
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pl-11 py-2 space-y-2">
                                    <Link href="/admin/users" className="block w-full">
                                        <div className="py-2 hover:text-primary transition-colors cursor-pointer text-sm">
                                            Gerenciar Usuários
                                        </div>
                                    </Link>
                                    <Link href="/admin/pending" className="block w-full">
                                        <div className="py-2 hover:text-primary transition-colors cursor-pointer text-sm">
                                            Listas Pendentes
                                        </div>
                                    </Link>
                                    <Link href="/summary/shopping-lists-admin" className="block w-full">
                                        <div className="py-2 hover:text-primary transition-colors cursor-pointer text-sm">
                                            Todas as Listas
                                        </div>
                                    </Link>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    )}
                </div>

                <div className="border-t pt-4">
                    <Button
                        variant="destructive"
                        className="w-full justify-start h-12"
                        onClick={() => signOut({ callbackUrl: "/login" })}
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sair
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
