'use client'

import { Moon, Sun } from 'lucide-react'
import { useState } from 'react'

type Theme = 'dark' | 'light'

const THEME_KEY = 'mbm-theme'
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

function persistTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  document.cookie = `${THEME_KEY}=${theme}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {}
}

export default function ThemeToggle({ initialTheme }: { initialTheme: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  const toggleTheme = () => {
    const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    persistTheme(nextTheme)
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
