"use client";

import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const SUGGESTIONS = {
    "Essenciais": ["Arroz", "Feijão", "Óleo", "Macarrão", "Café", "Açúcar", "Sal", "Farinha"],
    "Hortifruti": ["Tomate", "Cebola", "Batata", "Banana", "Maçã", "Alface", "Alho"],
    "Frios & Laticínios": ["Leite", "Manteiga", "Queijo", "Presunto", "Iogurte", "Ovos"],
    "Limpeza": ["Detergente", "Sabão em Pó", "Água Sanitária", "Amaciante", "Esponja", "Desinfetante"],
    "Higiene": ["Papel Higiênico", "Sabonete", "Pasta de Dente", "Shampoo", "Condicionador"],
};

interface SuggestedProductsProps {
    onSelect: (name: string) => void;
}

export function SuggestedProducts({ onSelect }: SuggestedProductsProps) {
    return (
        <div className="space-y-4 mt-6">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sugestões Rápidas</h3>

            <div className="space-y-4">
                {Object.entries(SUGGESTIONS).map(([category, items]) => (
                    <div key={category}>
                        <h4 className="text-xs font-semibold mb-2">{category}</h4>
                        <div className="flex flex-wrap gap-2">
                            {items.map((item) => (
                                <Badge
                                    key={item}
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                                    onClick={() => onSelect(item)}
                                >
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
