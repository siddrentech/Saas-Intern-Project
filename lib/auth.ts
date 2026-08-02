import { betterAuth } from "better-auth"
import { drizzleAdapter } from "@better-auth/drizzle-adapter"
import { db } from "@/db"
import { organization } from "better-auth/plugins"
import {
  saveDevPasswordResetLink,
  saveDevVerificationLink,
} from "@/lib/dev-verification-links"

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET ?? "dev-secret-change-me",
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      if (process.env.NODE_ENV !== "production") {
        saveDevPasswordResetLink(user.email, url)
      }
      console.log("Password reset link for", user.email)
      console.log(url)
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      if (process.env.NODE_ENV !== "production") {
        saveDevVerificationLink(user.email, url)
      }
      console.log("Verification link for", user.email)
      console.log(url)
    },
  },

  plugins: [
    organization(),
],
})
