'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ThemeToggle from '@/components/ThemeToggle'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  Building2
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Teachers', href: '/teachers', icon: Users },
  { name: 'Classes', href: '/classes', icon: GraduationCap },
  { name: 'Books', href: '/books', icon: BookOpen },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Depot Summary', href: '/depot-summary', icon: Package },
]

type Theme = 'dark' | 'light'

export default function Sidebar({ initialTheme }: { initialTheme: Theme }) {
  const pathname = usePathname()

  return (
    <>
      {/* App Header */}
      <div className="mobile-header app-header">
        <Link href="/" className="brand-shell">
          <span className="brand-emblem">
            <Building2 size={18} className="text-primary" />
          </span>
          <span className="brand-copy">
            <span className="brand-title">MADRASA BOOK MANAGER</span>
          <span className="brand-subtitle">Finance | Orders | Inventory</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="brand-chip">PREMIUM</span>
          <ThemeToggle initialTheme={initialTheme} />
        </div>
      </div>

      {/* Mobile Icon Navigation */}
      <nav className="mobile-bottom-nav fixed bottom-0 left-0 right-0 z-40 lg:hidden px-2 py-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={`mobile-${item.href}`}
                href={item.href}
                className={cn(
                  "mobile-nav-link btn btn-secondary flex-col gap-1 px-4 py-3 whitespace-nowrap border",
                  isActive
                    ? "mobile-nav-link-active"
                    : "mobile-nav-link-idle"
                )}
              >
                <item.icon size={18} />
                <span className="text-xs font-bold">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Sidebar */}
      <aside className="sidebar desktop-sidebar sidebar-panel">
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link desktop-nav-link group relative overflow-hidden transition-all duration-300",
                  isActive ? "desktop-nav-link-active" : "desktop-nav-link-idle"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-full shadow-primary-glow"></div>
                )}
                <item.icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                <span className="font-bold tracking-tight">{item.name}</span>
                {!isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="pt-4 border-t border-border mt-auto">
          <p className="text-xs text-muted text-center italic">(c) 2026 Madrasa Book Depot</p>
        </div>
      </aside>
    </>
  )
}
