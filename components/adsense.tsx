"use client";

import { useEffect } from "react";

interface AdSenseProps {
    adSlot: string;
    adFormat?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
    fullWidthResponsive?: boolean;
    className?: string;
}

export function AdSense({
    adSlot,
    adFormat = "auto",
    fullWidthResponsive = true,
    className = ""
}: AdSenseProps) {
    useEffect(() => {
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className={`adsense-container ${className}`}>
            <ins
                className="adsbygoogle"
                style={{ display: "block" }}
                data-ad-client="ca-pub-8911347909113264"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive={fullWidthResponsive.toString()}
            />
        </div>
    );
}

// Componente para anúncio responsivo padrão
export function AdSenseResponsive({ className = "" }: { className?: string }) {
    return (
        <AdSense
            adSlot="YOUR_AD_SLOT_ID" // Substitua pelo ID do slot do anúncio
            adFormat="auto"
            fullWidthResponsive={true}
            className={className}
        />
    );
}

// Componente para anúncio in-feed (entre conteúdos)
export function AdSenseInFeed({ className = "" }: { className?: string }) {
    return (
        <AdSense
            adSlot="YOUR_INFEED_AD_SLOT_ID" // Substitua pelo ID do slot in-feed
            adFormat="fluid"
            className={className}
        />
    );
}

// Componente para anúncio in-article (dentro de artigos)
export function AdSenseInArticle({ className = "" }: { className?: string }) {
    return (
        <AdSense
            adSlot="YOUR_INARTICLE_AD_SLOT_ID" // Substitua pelo ID do slot in-article
            adFormat="fluid"
            className={className}
        />
    );
}
