"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  LayoutDashboard, 
  Menu, 
  Settings,
  Store,
  Users
} from "lucide-react"
import SignOutButton from "@/components/auth/sign-out-button"

const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    label: 'Menu',
    icon: Menu,
    href: '/dashboard/menu',
  },
  {
    label: 'Orders',
    icon: Store,
    href: '/dashboard/orders',
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/dashboard/customers',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="p-6">
        <h1 className="text-xl font-bold tracking-tight">Here2Order</h1>
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1">
          {routes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                pathname === route.href && "bg-secondary"
              )}
              asChild
            >
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="mt-auto border-t p-3">
        <SignOutButton />
      </div>
    </div>
  )
} 