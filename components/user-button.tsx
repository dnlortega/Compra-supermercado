"use client"

import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { UserSidebar } from "@/components/user-sidebar"
import { User } from "lucide-react"
import Image from "next/image"

export function UserButton() {
    const { data: session } = useSession()

    if (!session?.user) return null

    return (
        <UserSidebar user={session.user}>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden border">
                {session.user.image ? (
                    <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <User className="h-5 w-5" />
                )}
            </Button>
        </UserSidebar>
    )
}
