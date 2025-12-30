
import { getAllOpenLists } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, User, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminPendingListsPage() {
    const openLists = await getAllOpenLists();

    return (
        <div className="container mx-auto p-4 max-w-4xl space-y-6 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <AlertCircle className="h-6 w-6 text-yellow-500" />
                        Listas Pendentes (Geral)
                    </h1>
                    <p className="text-sm text-muted-foreground">Todas as listas em aberto no sistema</p>
                </div>
            </div>

            <div className="grid gap-4">
                {openLists.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                        Nenhuma lista pendente encontrada no sistema.
                    </div>
                ) : (
                    openLists.map((list) => (
                        <Link key={list.id} href={`/admin/users/${list.userId}/lists`} className="block">
                            <Card className="hover:bg-accent/50 transition-colors border-l-4 border-l-yellow-400 hover:border-l-yellow-500">
                                <CardContent className="p-4">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                        {/* User Info */}
                                        <div className="flex items-center gap-3 min-w-[200px]">
                                            <div className="relative h-10 w-10 rounded-full overflow-hidden bg-background border shadow-sm flex-shrink-0">
                                                {list.user.image ? (
                                                    <Image src={list.user.image} alt={list.user.name || ""} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full w-full bg-muted text-muted-foreground font-bold">
                                                        {list.user.name?.[0] || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-sm font-bold truncate">{list.user.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{list.user.email}</p>
                                            </div>
                                        </div>

                                        {/* List Info */}
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-lg">{list.name || "Lista sem nome"}</span>
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200 gap-1 pl-1 pr-2">
                                                    <ShoppingCart className="h-3 w-3" />
                                                    Aberta
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(list.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                                <span>•</span>
                                                <span>{list._count.items} itens</span>
                                            </div>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
