"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    requestNotificationPermission,
    showPendingItemsNotification,
    areNotificationsSupported,
    getNotificationPermission,
} from "@/lib/notifications";

interface NotificationManagerProps {
    pendingItemsCount: number;
}

export function NotificationManager({ pendingItemsCount }: NotificationManagerProps) {
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [showBanner, setShowBanner] = useState(false);
    const [notificationSent, setNotificationSent] = useState(false);

    useEffect(() => {
        if (areNotificationsSupported()) {
            setPermission(getNotificationPermission());

            // Show banner if permission is default and there are pending items
            if (getNotificationPermission() === "default" && pendingItemsCount > 0) {
                setShowBanner(true);
            }
        }
    }, [pendingItemsCount]);

    useEffect(() => {
        // Send notification if permission is granted and there are pending items
        if (permission === "granted" && pendingItemsCount > 0 && !notificationSent) {
            // Wait 5 seconds before showing notification (to avoid spamming on page load)
            const timer = setTimeout(() => {
                showPendingItemsNotification(pendingItemsCount);
                setNotificationSent(true);
            }, 5000);

            return () => clearTimeout(timer);
        }

        // Reset notification sent flag when items count changes
        if (pendingItemsCount === 0) {
            setNotificationSent(false);
        }
    }, [permission, pendingItemsCount, notificationSent]);

    const handleEnableNotifications = async () => {
        const result = await requestNotificationPermission();
        setPermission(result);
        setShowBanner(false);

        if (result === "granted" && pendingItemsCount > 0) {
            // Show notification immediately after permission is granted
            setTimeout(() => {
                showPendingItemsNotification(pendingItemsCount);
                setNotificationSent(true);
            }, 500);
        }
    };

    if (!areNotificationsSupported()) {
        return null;
    }

    if (!showBanner) {
        return null;
    }

    return (
        <Card className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 animate-in slide-in-from-top duration-500">
            <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Bell className="size-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-sm">Ativar Notificações 🔔</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                                Receba lembretes quando tiver itens pendentes na sua lista de compras!
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-6 -mt-1 -mr-1"
                            onClick={() => setShowBanner(false)}
                        >
                            <X className="size-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={handleEnableNotifications}
                            className="text-xs font-bold"
                        >
                            <Bell className="size-3 mr-1.5" />
                            Ativar
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowBanner(false)}
                            className="text-xs"
                        >
                            Agora não
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

export function NotificationStatus() {
    const [permission, setPermission] = useState<NotificationPermission>("default");

    useEffect(() => {
        if (areNotificationsSupported()) {
            setPermission(getNotificationPermission());
        }
    }, []);

    if (!areNotificationsSupported()) {
        return null;
    }

    const handleToggle = async () => {
        if (permission !== "granted") {
            const result = await requestNotificationPermission();
            setPermission(result);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="gap-2"
            disabled={permission === "denied"}
        >
            {permission === "granted" ? (
                <>
                    <Bell className="size-4 text-primary" />
                    <span className="text-xs">Notificações Ativas</span>
                </>
            ) : permission === "denied" ? (
                <>
                    <BellOff className="size-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Bloqueadas</span>
                </>
            ) : (
                <>
                    <BellOff className="size-4" />
                    <span className="text-xs">Ativar Notificações</span>
                </>
            )}
        </Button>
    );
}
