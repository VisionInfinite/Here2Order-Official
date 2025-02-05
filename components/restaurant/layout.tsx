'use client'

import { RestaurantSidebar } from '@/components/restaurant/sidebar'
import { UserNav } from '@/components/user-nav'
import { ThemeToggle } from '@/components/theme-toggle'

interface RestaurantLayoutProps {
  children: React.ReactNode
}

export function RestaurantLayout({ children }: RestaurantLayoutProps) {
  return (
    <div className="flex h-screen">
      <RestaurantSidebar />
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 items-center justify-end gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="container py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 