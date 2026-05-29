import "next-auth"

declare module "next-auth" {
  interface User {
    username?: string
    isPro?: boolean
  }
  interface Session {
    user: {
      id: string
      username: string
      isPro: boolean
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    username: string
    isPro: boolean
  }
}
