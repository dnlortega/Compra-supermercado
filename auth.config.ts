import Google from "next-auth/providers/google"
import type { NextAuthConfig } from "next-auth"

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: "/login",
    },
    trustHost: true,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnLoginPage = nextUrl.pathname.startsWith("/login")

            if (isOnLoginPage) {
                if (isLoggedIn) return Response.redirect(new URL("/", nextUrl))
                return true
            }

            return isLoggedIn
        },
    },
} satisfies NextAuthConfig
