"use client";

import { useEffect, useState } from "react";

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
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Verificar se o slot está configurado
        if (!adSlot || adSlot.includes("YOUR_")) {
            return;
        }

        // Aguardar o script do AdSense carregar antes de inicializar
        const initAdSense = () => {
            try {
                if (typeof window !== "undefined") {
                    const adsbygoogle = (window as any).adsbygoogle;
                    if (adsbygoogle && adsbygoogle.loaded) {
                        adsbygoogle.push({});
                        setIsReady(true);
                        return true;
                    } else if (adsbygoogle) {
                        adsbygoogle.push({});
                        setIsReady(true);
                        return true;
                    }
                }
            } catch (err) {
                console.error("AdSense error:", err);
            }
            return false;
        };

        // Tentar inicializar imediatamente
        if (initAdSense()) {
            return;
        }

        // Se não funcionar, tentar novamente após delays
        const timeouts = [
            setTimeout(() => {
                if (initAdSense()) return;
            }, 500),
            setTimeout(() => {
                if (initAdSense()) return;
            }, 2000),
        ];

        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, [adSlot]);

    // Não renderizar se o slot não estiver configurado
    if (!adSlot || adSlot.includes("YOUR_")) {
        return null;
    }

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
