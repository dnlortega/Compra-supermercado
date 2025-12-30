import { getAllUsersWithSharing } from "@/app/actions/admin";
import { UserSharingManager } from "@/components/admin/user-sharing-manager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Shield, Users } from "lucide-react";
import Image from "next/image";

// Revalidar a cada 0 segundos (sem cache) para garantir dados frescos no admin
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
    const users = await getAllUsersWithSharing();

    // Simplification for the child component
    const plainUsers = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image
    }));

    return (
        <div className="container mx-auto p-4 max-w-4xl space-y-6 pb-24 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Shield className="h-6 w-6 text-primary" />
                        Gestão de Usuários
                    </h1>
                    <p className="text-sm text-muted-foreground">Gerencie quem pode ver os dados de quem.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {users.map(user => (
                    <Card key={user.id} className="overflow-hidden border-muted">
                        <CardHeader className="bg-muted/30 pb-4 border-b">
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-background border-2 shadow-sm">
                                        {user.image ? (
                                            <Image src={user.image} alt={user.name || ""} fill className="object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full bg-primary/10 text-primary font-bold">
                                                {user.name?.[0] || "?"}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">{user.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-xs text-muted-foreground bg-background/50 p-2 rounded-lg border">
                                    <div className="text-center px-2">
                                        <span className="font-bold text-lg block text-foreground">{user.sharedWith.length}</span>
                                        Compartilhando
                                    </div>
                                    <div className="w-px h-8 bg-border"></div>
                                    <div className="text-center px-2">
                                        <span className="font-bold text-lg block text-foreground">{user.sharedBy.length}</span>
                                        Recebendo
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <p className="text-sm font-medium mb-4 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Permissões de Acesso
                            </p>
                            <UserSharingManager user={user} allUsers={plainUsers} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
