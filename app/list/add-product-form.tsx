"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { getAllCatalogProducts } from "@/app/actions/catalog";

export default function AddProductForm() {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [catalog, setCatalog] = useState<any[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadCatalog = async () => {
            const data = await getAllCatalogProducts();
            setCatalog(data);
        };
        loadCatalog();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (value: string) => {
        setName(value);

        if (value.trim().length > 0) {
            const filtered = catalog
                .filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
                .map(item => item.name);
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setName(suggestion);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            const result = await addProduct({ name, quantity });
            if (result && !result.success) {
                toast.error(result.error || "Erro ao adicionar produto");
                return;
            }
            setName("");
            setQuantity(1);
            setShowSuggestions(false);
            toast.success("Produto adicionado!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao adicionar produto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit} className="flex gap-2 items-end bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex-1 space-y-2 relative">
                    <label className="text-sm font-medium">Produto</label>
                    <Input
                        ref={inputRef}
                        placeholder="Ex: Arroz 5kg"
                        value={name}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onFocus={() => {
                            if (name.trim().length > 0 && filteredSuggestions.length > 0) {
                                setShowSuggestions(true);
                            }
                        }}
                        disabled={loading}
                        autoComplete="off"
                        spellCheck="true"
                        autoCorrect="on"
                        autoCapitalize="sentences"
                    />

                    {showSuggestions && filteredSuggestions.length > 0 && (
                        <div
                            ref={suggestionsRef}
                            className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
                        >
                            {filteredSuggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground transition-colors text-sm"
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="w-24 space-y-2">
                    <label className="text-sm font-medium">Qtd</label>
                    <Input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        disabled={loading}
                    />
                </div>
                <Button type="submit" loading={loading}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                </Button>
            </form>
        </div>
    );
}
