'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  QrCode,
  LineChart,
  Settings,
  ChevronLeft,
  ChevronRight,
  Store,
  Menu as MenuIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Menu',
    icon: MenuIcon,
    href: '/dashboard/menu',
    color: 'text-orange-500',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    color: 'text-gray-500',
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: ClipboardList,
    description: 'Manage customer orders',
  },
  {
    title: 'Restaurant',
    href: '/dashboard/restaurant', 
    icon: Store,
    description: 'Manage restaurant profile',
  },
  {
    title: 'QR Codes',
    href: '/dashboard/qr-codes',
    icon: QrCode,
    description: 'Generate and manage QR codes',
  },
  {
    title: 'Sales',
    href: '/dashboard/sales',
    icon: LineChart,
    description: 'View sales analytics',
  },
]

export function RestaurantSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { user } = useAuthStore()

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsCollapsed(window.innerWidth < 1024)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Restaurant Info */}
      <div className="flex h-14 items-center border-b px-4">
        <Store className="h-6 w-6 text-primary" />
        {!isCollapsed && (
          <div className="ml-2 overflow-hidden">
            <p className="truncate text-sm font-semibold">
              {user?.restaurant?.name || 'Restaurant Name'}
            </p>
          </div>
        )}
      </div>

      {/* Collapse Button (show only on desktop) */}
      {!isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-20 h-8 w-8 rounded-full border bg-background shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="flex flex-col gap-2">
          {routes.map((route) => {
            const Icon = route.icon
            const isActive = pathname === route.href

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                  isCollapsed && 'justify-center'
                )}
                title={isCollapsed ? route.label : undefined}
              >
                <Icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                {!isCollapsed && (
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium leading-none">
                      {route.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {route.description}
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Version number */}
      <div className={cn(
        'border-t p-4 text-sm text-muted-foreground',
        isCollapsed && 'text-center'
      )}>
        {!isCollapsed ? 'Here2Order v1.0.0' : 'v1.0.0'}
      </div>
    </div>
  )
} 