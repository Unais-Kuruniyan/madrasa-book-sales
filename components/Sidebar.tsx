'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  ShoppingCart, 
  CreditCard, 
  Package, 
  Menu, 
  X 
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

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Header */}
      <div className="mobile-header bg-card/40 backdrop-blur-xl border-b border-white/5">
        <span className="text-xl font-black bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent group-hover:from-white group-hover:to-white/80 transition-all duration-500">MADRASA MANAGER</span>
        <button className="btn btn-secondary p-2 bg-white/5 border border-white/10" onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn("sidebar bg-card/20 backdrop-blur-2xl border-r border-white/5 shadow-2xl", isOpen && "open")}>
        <div className="flex justify-between items-center mb-12 px-2">
          <Link href="/" className="group flex flex-col" onClick={() => setIsOpen(false)}>
            <span className="text-2xl font-black tracking-tighter text-white group-hover:text-primary transition-colors">MADRASA</span>
            <span className="text-[10px] font-bold tracking-[0.4em] text-primary/80 -mt-1 group-hover:text-white transition-colors">MANAGEMENT</span>
          </Link>
          <button className="lg:hidden p-2 text-muted-foreground hover:text-white transition-colors" onClick={() => setIsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-link group relative overflow-hidden transition-all duration-300",
                  isActive ? "bg-primary/20 text-white shadow-lg shadow-primary/10 ring-1 ring-primary/30" : "hover:bg-white/5"
                )}
                onClick={() => setIsOpen(false)}
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
