import { useTheme } from '../context/ThemeContext'
export default function Topbar() {
  const { dark, toggleTheme } = useTheme()
  return (
    <header className="bg-(--surface) border-b border-(--border) px-6 h-13 flex items-center gap-3 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-(--accent)" />
        <span className="text-sm font-medium text-(--text)">
          Fallbrook <span className="text-(--muted) font-normal">/ Dashboard</span>
        </span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-(--text2) bg-(--surface2) border border-(--border) px-3 py-1 rounded-full">
          👤 Oskar · Staff
        </span>
        <button 
          onClick={toggleTheme}
          className="text-xs text-(--text2) bg-(--surface2) border border-(--border) px-3 py-1.5 rounded-lg hover:bg-(--border) cursor-pointer">
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button className="text-xs text-(--danger) border border-(--danger) px-3 py-1.5 rounded-lg hover:bg-(--danger-bg) cursor-pointer">
          Logout
        </button>
      </div>
    </header>
  )
}