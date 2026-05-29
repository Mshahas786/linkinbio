import { NextAuthOptions, getServerSession } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import bcrypt from "bcryptjs"
import prisma from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name, image: user.image }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "credentials") return true

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email! },
      })

      if (existingUser && !existingUser.username) {
        const base = (user.name || user.email?.split("@")[0] || "user")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
        const suffix = Math.random().toString(36).substring(2, 6)
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { username: `${base}${suffix}` },
        })
      }

      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: token.email! },
        select: { id: true, username: true, subscription: { select: { status: true } } },
      })

      if (dbUser) {
        token.id = dbUser.id
        token.username = dbUser.username
        token.isPro = dbUser.subscription?.status === "active"
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.username = token.username as string
        session.user.isPro = token.isPro as boolean
      }
      return session
    },
  },
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}
