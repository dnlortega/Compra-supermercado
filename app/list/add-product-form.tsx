"use client";

import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { getAllProductNames } from "@/app/actions/products";

export default function AddProductForm() {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [catalog, setCatalog] = useState<any[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ name?: string; quantity?: string }>({});
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;
        const loadNames = async () => {
            try {
                const data = await getAllProductNames() as string[];
                if (mounted) {
                    setCatalog(data.map((n) => ({ name: n })));
                }
            } catch (error) {
                console.error("Error loading product names:", error);
            }
        };
        loadNames();
        return () => { mounted = false; };
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

        // Use requestAnimationFrame to defer filtering for better performance
        requestAnimationFrame(() => {
            if (value.trim().length > 0) {
                const lowerValue = value.toLowerCase();
                const filtered = catalog
                    .filter(item => item.name.toLowerCase().includes(lowerValue))
                    .map(item => item.name);
                setFilteredSuggestions(filtered);
                setShowSuggestions(filtered.length > 0);
            } else {
                setShowSuggestions(false);
            }
        });
    };

    const handleSuggestionClick = (suggestion: string) => {
        setName(suggestion);
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const validateForm = () => {
        const newErrors: { name?: string; quantity?: string } = {};

        if (!name.trim()) {
            newErrors.name = "O nome do produto é obrigatório";
        }

        if (!quantity || quantity < 1) {
            newErrors.quantity = "A quantidade deve ser maior que zero";
        }

        if (isNaN(quantity) || quantity <= 0) {
            newErrors.quantity = "A quantidade deve ser um número válido maior que zero";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            if (errors.name) toast.error(errors.name);
            if (errors.quantity) toast.error(errors.quantity);
            return;
        }

        setLoading(true);
        setErrors({});
        try {
            const result = await addProduct({ name: name.trim(), quantity });
            if (result && !result.success) {
                toast.error(result.error || "Erro ao adicionar produto");
                setLoading(false);
                return;
            }
            setName("");
            setQuantity(1);
            setShowSuggestions(false);
            toast.success("Produto adicionado!");
            router.refresh();
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
                        onChange={(e) => {
                            handleInputChange(e.target.value);
                            if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                        }}
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
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                    )}

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
                        onChange={(e) => {
                            const value = parseInt(e.target.value);
                            setQuantity(isNaN(value) ? 0 : value);
                            if (errors.quantity) setErrors(prev => ({ ...prev, quantity: undefined }));
                        }}
                        onFocus={(e) => e.target.select()}
                        disabled={loading}
                        className={errors.quantity ? "border-red-500" : ""}
                    />
                    {errors.quantity && (
                        <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>
                    )}
                </div>
                <Button type="submit" loading={loading} size="icon">
                    <Plus className="w-4 h-4" />
                </Button>
            </form>
        </div>
    );
}
