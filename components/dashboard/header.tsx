"use client"

import { UserNav } from "@/components/dashboard/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { Bell } from "lucide-react"

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background-50/80 backdrop-blur-sm dark:bg-background-950/80">
      <div className="flex h-16 items-center px-6">
        <div className="ml-64 flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-text-900 dark:text-text-50">
              Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="rounded-full p-2 hover:bg-background-100 dark:hover:bg-background-900">
              <Bell className="h-5 w-5 text-text-500" />
            </button>
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
} 