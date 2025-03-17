import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db/index"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: DrizzleAdapter(db),
    providers: [Google],
    pages: {
        signIn: "/auth/login",
    },
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth;
        }
    }
})