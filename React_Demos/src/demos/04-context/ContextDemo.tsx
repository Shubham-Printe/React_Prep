import { createContext, ReactNode, useContext, useState } from 'react'

type Theme = 'light' | 'dark'
interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}
const ThemeContext = createContext<ThemeContextValue | null>(null)

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}

function ThemedBox() {
  const { theme } = useTheme()
  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: theme === 'light' ? '#f4f4f4' : '#1f2937',
        color: theme === 'light' ? '#111' : '#fff',
      }}
    >
      ThemedBox uses context: theme is {theme}
    </div>
  )
}

function ThemeToggle() {
  const { toggle } = useTheme()
  return <button onClick={toggle}>Toggle Theme</button>
}

export default function ContextDemo() {
  return (
    <section>
      <ThemeProvider>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ThemeToggle />
          <ThemedBox />
        </div>
      </ThemeProvider>
    </section>
  )
}


