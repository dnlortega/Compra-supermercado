"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function ProgressBar() {
    const pathname = usePathname();
    const [progress, setProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        setProgress(20);

        const timer1 = setTimeout(() => setProgress(60), 100);
        const timer2 = setTimeout(() => setProgress(90), 300);
        const timer3 = setTimeout(() => {
            setProgress(100);
            setTimeout(() => setIsLoading(false), 200);
        }, 500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
        };
    }, [pathname]);

    if (!isLoading && progress === 100) return null;

    return (
        <div
            className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden"
            style={{ opacity: isLoading ? 1 : 0, transition: "opacity 0.2s" }}
        >
            <div
                className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-300 ease-out"
                style={{
                    width: `${progress}%`,
                    boxShadow: "0 0 10px rgba(66, 133, 244, 0.5)",
                }}
            />
        </div>
    );
}
