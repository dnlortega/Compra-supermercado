import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { prisma } from "@/lib/db"
import { compare } from "bcryptjs"
import Google from "next-auth/providers/google"

export default {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const { email, password } = credentials ?? {}

                if (!email || !password) return null

                const user = await prisma.user.findUnique({
                    where: { email: email as string }
                })

                if (!user || !user.password) {
                    return null
                }

                const passwordsMatch = await compare(
                    password as string,
                    user.password
                )

                if (!passwordsMatch) return null

                return user
            }
        })
    ],
    pages: {
        signIn: "/login",
    },
    trustHost: true,
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnLoginPage = nextUrl.pathname.startsWith("/login")
            const isOnRegisterPage = nextUrl.pathname.startsWith("/register")

            if (isOnLoginPage || isOnRegisterPage) {
                if (isLoggedIn) return Response.redirect(new URL("/", nextUrl))
                return true
            }

            return isLoggedIn
        },
    },
} satisfies NextAuthConfig
