import { auth } from "@/auth"

export async function getSession() {
    return await auth()
}

export async function getCurrentUser() {
    const session = await getSession()
    return session?.user
}

export async function requireUser() {
    const user = await getCurrentUser()
    if (!user || !user.id) {
        throw new Error("Usuário não autenticado")
    }
    return user
}
