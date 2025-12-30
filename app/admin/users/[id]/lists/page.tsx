import { getShoppingListsForUser } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, ShoppingBag, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminUserListsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const lists = await getShoppingListsForUser(id);

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
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        Listas do Usuário
                    </h1>
                </div>
            </div>

            <div className="grid gap-4">
                {lists.length === 0 ? (
                    <div className="text-center p-8 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
                        Nenhuma lista encontrada para este usuário.
                    </div>
                ) : (
                    lists.map((list) => (
                        <Link key={list.id} href={`/history/${list.id}`} className="block">
                            <Card className="hover:bg-accent/50 transition-colors border-l-4 border-l-primary/20 hover:border-l-primary">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-lg">{list.name || "Lista sem nome"}</span>
                                            {list.status === "COMPLETED" ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200 gap-1 pl-1 pr-2">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Finalizada
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground gap-1 pl-1 pr-2">
                                                    <Circle className="h-3 w-3" />
                                                    Aberta
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            {format(new Date(list.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                            <span>•</span>
                                            <span>{list._count.items} itens</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-primary">
                                            {formatCurrency(list.total)}
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
