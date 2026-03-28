import './globals.css'
import type { Metadata, Viewport } from 'next'
import Sidebar from '@/components/Sidebar'
import { cookies } from 'next/headers'
import AppBootstrap from '@/components/AppBootstrap'

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Madrasa Book Manager',
  description: 'Manage textbook orders, payments, and distribution.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Madrasa Books',
  },
}

type Theme = 'dark' | 'light'

function normalizeTheme(value: string | undefined): Theme {
  return value === 'light' ? 'light' : 'dark'
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const theme = normalizeTheme(cookieStore.get('mbm-theme')?.value)

  return (
    <html lang="en" data-theme={theme} suppressHydrationWarning>
      <body>
        <div className="flex">
          <Sidebar initialTheme={theme} />
          <main className="main-content">
            {children}
          </main>
        </div>
        <AppBootstrap />
      </body>
    </html>
  )
}
