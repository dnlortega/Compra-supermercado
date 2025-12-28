"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (typeof window !== "undefined") {
            const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
            const isInAppBrowser = (window.navigator as any).standalone === true;

            if (isStandalone || isInAppBrowser) {
                setIsInstalled(true);
                return;
            }

            // Check if user already dismissed the banner
            const dismissed = localStorage.getItem("pwa-install-dismissed");
            if (dismissed) {
                const dismissedDate = new Date(dismissed);
                const now = new Date();
                const daysSinceDismissed = Math.floor((now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24));

                // Show again after 7 days
                if (daysSinceDismissed < 7) {
                    return;
                }
            }
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setShowInstallBanner(true);
        };

        window.addEventListener("beforeinstallprompt", handler);

        // Check if app was installed
        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setShowInstallBanner(false);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
        } else {
            console.log("User dismissed the install prompt");
        }

        setDeferredPrompt(null);
        setShowInstallBanner(false);
    };

    const handleDismiss = () => {
        setShowInstallBanner(false);
        localStorage.setItem("pwa-install-dismissed", new Date().toISOString());
    };

    if (isInstalled || !showInstallBanner) {
        return null;
    }

    // Detectar iOS
    const isIOS = typeof window !== "undefined" && /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = typeof window !== "undefined" && /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    return (
        <div className="fixed bottom-24 left-0 right-0 z-40 px-4 pb-4 pointer-events-none">
            <Card className="p-4 bg-gradient-to-r from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg animate-in slide-in-from-bottom duration-500 pointer-events-auto max-w-md mx-auto">
                <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2.5 rounded-full">
                        <Smartphone className="size-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h3 className="font-bold text-sm flex items-center gap-2">
                                    Instalar App 📱
                                </h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                    {isIOS && isSafari 
                                        ? "Toque no botão Compartilhar (□↑) e selecione 'Adicionar à Tela de Início'"
                                        : "Adicione à tela inicial para acesso rápido e notificações!"
                                    }
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-6 -mt-1 -mr-1 shrink-0"
                                onClick={handleDismiss}
                            >
                                <X className="size-4" />
                            </Button>
                        </div>
                        {!isIOS && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    onClick={handleInstallClick}
                                    className="text-xs font-bold bg-primary hover:bg-primary/90"
                                >
                                    <Download className="size-3.5 mr-1.5" />
                                    Instalar Agora
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleDismiss}
                                    className="text-xs"
                                >
                                    Mais tarde
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}

// Component to show install button in settings or menu
export function InstallButton() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
            const isInAppBrowser = (window.navigator as any).standalone === true;

            if (isStandalone || isInAppBrowser) {
                setIsInstalled(true);
                return;
            }
        }

        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
        };

        window.addEventListener("beforeinstallprompt", handler);

        window.addEventListener("appinstalled", () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener("beforeinstallprompt", handler);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            return;
        }

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            console.log("User accepted the install prompt");
        }

        setDeferredPrompt(null);
    };

    if (isInstalled) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Smartphone className="size-4 text-primary" />
                <span>App Instalado ✓</span>
            </div>
        );
    }

    if (!deferredPrompt) {
        return null;
    }

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleInstallClick}
            className="gap-2"
        >
            <Download className="size-4" />
            <span>Instalar App</span>
        </Button>
    );
}
