import { Loader2 } from "lucide-react";

export function PageLoader() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>

                    {/* Middle spinning ring */}
                    <div className="relative rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent w-16 h-16 animate-spin"></div>

                    {/* Inner icon */}
                    <Loader2 className="absolute inset-0 m-auto h-8 w-8 text-primary animate-pulse" />
                </div>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando...</p>
            </div>
        </div>
    );
}

export function InlineLoader({ text = "Carregando..." }: { text?: string }) {
    return (
        <div className="flex items-center justify-center gap-2 p-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">{text}</span>
        </div>
    );
}

export function ButtonLoader() {
    return <Loader2 className="h-4 w-4 animate-spin" />;
}

export function SkeletonCard() {
    return (
        <div className="rounded-lg border bg-card p-4 space-y-3 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-2/3"></div>
        </div>
    );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
}
