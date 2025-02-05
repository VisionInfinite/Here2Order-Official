"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Menu,
  ClipboardList,
  Users,
  Settings,
  Store,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/lib/store/auth-store"
import { User } from '@/lib/types'
import { toast } from "sonner"

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview of your restaurant'
  },
  {
    name: 'Menu',
    href: '/dashboard/menu',
    icon: Menu,
    description: 'Manage your menu items'
  },
  {
    name: 'Orders',
    href: '/dashboard/orders',
    icon: ClipboardList,
    description: 'Track and manage orders'
  },
  {
    name: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
    description: 'View customer information'
  },
  {
    name: 'Restaurant',
    href: '/dashboard/restaurant',
    icon: Store,
    description: 'Manage restaurant profile'
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'Configure your settings'
  }
]

export const Sidebar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      // First clear the auth store
      logout()

      // Then make the API call
      const response = await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to logout')
      }

      // Show success message
      toast.success('Logged out successfully')

      // Force a complete page reload and redirect
      setTimeout(() => {
        window.location.replace('/login')
      }, 100)

    } catch (error) {
      toast.error('Failed to logout')
      // Revert auth store on error
      window.location.reload()
    }
  }

  return (
    <aside className="relative">
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
                 rounded-lg border shadow-sm hover:bg-accent transition-colors"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Sidebar */}
      <div className={cn(
        "fixed md:sticky top-0 h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "w-[280px] transition-all duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        {/* Restaurant Info */}
        <div className="flex h-16 items-center border-b px-6 shrink-0">
          <Store className="h-5 w-5 text-primary" />
          <div className="ml-3 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {user?.restaurant?.name || 'Restaurant Name'}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-1">
            {navigation.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-all',
                    'hover:bg-accent/50 active:bg-accent/70',
                    isActive 
                      ? 'bg-accent/40 text-primary font-medium' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon 
                    className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} 
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="font-medium leading-none">
                      {link.name}
                    </span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {link.description}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="shrink-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-6 py-3 text-sm text-destructive 
                     hover:bg-destructive/10 active:bg-destructive/20 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
          
          <div className="px-6 py-4 text-xs text-muted-foreground/60 text-center">
            Here2Order v1.0.0
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </aside>
  )
} 