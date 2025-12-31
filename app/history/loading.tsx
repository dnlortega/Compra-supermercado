import { SkeletonList } from "@/components/loading";

export default function Loading() {
    return (
        <div className="container mx-auto p-4 max-w-2xl space-y-6">
            <div className="h-12 bg-muted rounded-lg animate-pulse w-48"></div>
            <SkeletonList count={5} />
        </div>
    );
}
