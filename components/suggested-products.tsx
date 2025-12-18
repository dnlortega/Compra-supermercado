"use client";

import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { getCatalogProducts, seedCatalog } from "@/app/actions/catalog";

interface SuggestedProductsProps {
    onSelect: (name: string) => void;
}

import { Skeleton } from "@/components/ui/skeleton";

export function SuggestedProducts({ onSelect }: SuggestedProductsProps) {
    const [catalog, setCatalog] = useState<Record<string, any[]>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                await seedCatalog(); // Populate if empty
                const data = await getCatalogProducts();
                setCatalog(data);
            } catch (error) {
                console.error("Error loading catalog", error);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="space-y-4 mt-6 animate-in fade-in duration-500">
                <Skeleton className="h-4 w-32" />
                <div className="space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-3 w-20" />
                            <div className="flex flex-wrap gap-2">
                                {[1, 2, 3, 4, 5].map(j => (
                                    <Skeleton key={j} className="h-6 w-16 rounded-full" />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const categories = Object.keys(catalog);
    if (categories.length === 0) return null;

    return (
        <div className="space-y-4 mt-6 animate-in fade-in slide-in-from-top-2 duration-500">

            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sugestões Rápidas</h3>

            <div className="space-y-4">
                {categories.map((category) => (
                    <div key={category}>
                        <h4 className="text-xs font-semibold mb-2">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                            {catalog[category].map((item: any) => (
                                <Badge
                                    key={item.id}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                                    onClick={() => onSelect(item.name)}
                                >
                                    {item.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
