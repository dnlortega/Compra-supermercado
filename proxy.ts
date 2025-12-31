import NextAuth from "next-auth"
import authConfig from "./auth.config"

export default NextAuth(authConfig).auth

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|icon-192x192.png|manifest.json).*)"],
}
