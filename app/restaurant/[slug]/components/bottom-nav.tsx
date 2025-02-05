'use client'

import { Home, Menu, ShoppingCart, User } from 'lucide-react'
import Link from 'next/link'

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around p-3">
        <Link href="#" className="flex flex-col items-center">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <Menu className="h-6 w-6" />
          <span className="text-xs mt-1">Menu</span>
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <ShoppingCart className="h-6 w-6" />
          <span className="text-xs mt-1">Cart</span>
        </Link>
        <Link href="#" className="flex flex-col items-center">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  )
} 