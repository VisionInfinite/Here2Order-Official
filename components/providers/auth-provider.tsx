'use client'

import { useAuth, type User } from "@clerk/nextjs"
import { useEffect } from "react"
import { useAuthStore } from "@/lib/store/auth-store"
import Loading from "@/components/loading"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded: clerkLoaded, user } = useAuth()
  const { setLoaded, setUser } = useAuthStore()

  useEffect(() => {
    if (clerkLoaded) {
      setLoaded(true)
      // Pass the entire user object from Clerk
      setUser(user || null)
    }
  }, [clerkLoaded, user, setLoaded, setUser])

  // Show loading state while Clerk is initializing
  if (!clerkLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    )
  }

  return <>{children}</>
} 