/**
 * Request permission for browser notifications
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!("Notification" in window)) {
        console.log("This browser does not support notifications");
        return "denied";
    }

    if (Notification.permission === "granted") {
        return "granted";
    }

    if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
}

/**
 * Show a notification about pending shopping items
 */
export function showPendingItemsNotification(itemCount: number) {
    if (!("Notification" in window)) {
        return;
    }

    if (Notification.permission === "granted") {
        const notification = new Notification("Lista de Compras Pendente 🛒", {
            body: `Você tem ${itemCount} ${itemCount === 1 ? "item pendente" : "itens pendentes"} na sua lista de compras!`,
            icon: "/icon-192x192.png",
            badge: "/icon-192x192.png",
            tag: "pending-items",
            requireInteraction: false,
            data: {
                url: "/list",
            },
        });

        notification.onclick = function (event) {
            event.preventDefault();
            window.focus();
            window.location.href = "/list";
            notification.close();
        };

        // Auto close after 10 seconds
        setTimeout(() => {
            notification.close();
        }, 10000);
    }
}

/**
 * Check if notifications are supported
 */
export function areNotificationsSupported(): boolean {
    return "Notification" in window;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission {
    if (!("Notification" in window)) {
        return "denied";
    }
    return Notification.permission;
}
