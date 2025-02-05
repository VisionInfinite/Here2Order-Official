import { auth } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { SettingsForm } from "./components/settings-form"
import { redirect } from "next/navigation"

export default async function SettingsPage() {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {
      restaurant: true
    }
  })

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <SettingsForm user={user} restaurant={user.restaurant} />
    </div>
  )
} 