import { useState, useEffect } from 'react'
import Dashboard from './Dashboard'

function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('theme')
    if (stored) return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  })

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 font-sans transition-colors duration-300">
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="btn float-right mb-2 text-sm"
      >
        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1 className="text-2xl font-bold mb-4">🗓️ Daily Brief</h1>
      <Dashboard />
      <footer className="mt-8 text-center text-sm text-gray-500">
        Built by{' '}
        <a
          href="https://github.com/jwfoxjr"
          target="_blank"
          className="underline hover:text-gray-700"
        >
          Joe Fox
        </a>
      </footer>
    </div>
  )
}

export default App
