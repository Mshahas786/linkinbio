import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { Sidebar } from "@/components/dashboard/sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect("/login")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { username: true },
  })

  if (!user) redirect("/login")
  if (!user.username) redirect("/onboarding")

  return (
    <div className="flex min-h-screen">
      <Sidebar username={user.username} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
