'use client'

import Link from "next/link"
import { useAuthStore } from "@/lib/store/auth-store"

export function MainNav() {
  const user = useAuthStore((state) => state.user)

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link 
        href="/dashboard"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Dashboard
      </Link>
      {user?.role === 'SUPER_ADMIN' && (
        <>
          <Link 
            href="/dashboard/restaurants"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Restaurants
          </Link>
          <Link 
            href="/dashboard/users"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Users
          </Link>
        </>
      )}
      {user?.role === 'RESTAURANT_ADMIN' && (
        <>
          <Link 
            href="/dashboard/orders"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Orders
          </Link>
          <Link 
            href="/dashboard/menu"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Menu
          </Link>
        </>
      )}
    </nav>
  )
} 