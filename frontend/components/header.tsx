import { Search, Notifications, History } from 'lucide-react'

export function Header() {
  return (
    <header className="flex justify-between items-center px-8 py-4 w-full z-40 bg-background/40 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] sticky top-0">
      {/* Mobile Brand */}
      <div className="md:hidden flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-tertiary to-primary flex items-center justify-center">
          <span className="font-bold text-xs text-on-tertiary">A</span>
        </div>
        <span className="text-lg font-bold text-on-surface tracking-tight">Aura Finance</span>
      </div>

      {/* Search (Desktop) */}
      <div className="hidden md:flex items-center bg-white/5 rounded-full px-4 py-2 border border-white/10 w-64 focus-within:ring-2 focus-within:ring-tertiary/50 transition-all">
        <span className="material-symbols-outlined text-on-surface/50 mr-2 text-xl">search</span>
        <input 
          className="bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface/40 w-full p-0" 
          placeholder="Search..." 
          type="text"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="text-on-surface/60 hover:text-tertiary transition-colors duration-300 p-1">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-on-surface/60 hover:text-tertiary transition-colors duration-300 p-1 hidden sm:block">
          <span className="material-symbols-outlined">history</span>
        </button>
        <button className="w-8 h-8 rounded-full border border-white/20 overflow-hidden hover:ring-2 hover:ring-tertiary/50 transition-all">
          <img 
            src="https://avatar.vercel.sh/aura" 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  )
}
