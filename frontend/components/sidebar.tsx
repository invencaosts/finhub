import Link from 'next/link'

const navItems = [
  { icon: 'grid_view', label: 'Overview', active: true },
  { icon: 'account_balance_wallet', label: 'Assets' },
  { icon: 'swap_horiz', label: 'Activity' },
  { icon: 'track_changes', label: 'Goals' },
  { icon: 'monitoring', label: 'Market' },
]

export function Sidebar() {
  return (
    <nav className="hidden md:flex flex-col h-screen w-72 py-8 fixed left-0 top-0 z-50 bg-surface/30 backdrop-blur-2xl border-r border-white/5 shadow-2xl">
      <div className="px-8 mb-12">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-tertiary to-primary flex items-center justify-center shadow-[0_0_15px_rgba(60,221,199,0.3)]">
            <span className="font-bold text-on-tertiary">A</span>
          </div>
          <div>
            <h1 className="text-2xl font-black text-on-surface tracking-tight">AURA</h1>
            <span className="text-[10px] uppercase tracking-wider text-tertiary font-semibold">FINANCE</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href="#"
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 border-l-4 ${
                  item.active
                    ? 'border-tertiary bg-gradient-to-r from-tertiary/10 to-transparent text-on-surface font-semibold'
                    : 'border-transparent text-on-surface/60 hover:bg-white/5 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: item.active ? "'FILL' 1" : "''" }}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <div className="mt-12 px-4">
          <button className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-tertiary to-tertiary/80 text-on-tertiary text-sm font-semibold shadow-[0_4px_15px_rgba(60,221,199,0.2)] hover:shadow-[0_6px_20px_rgba(60,221,199,0.3)] transition-all">
            Explore Alpha
          </button>
        </div>
      </div>

      <div className="px-4 mt-auto">
        <ul className="space-y-2 border-t border-white/5 pt-4">
          <li>
            <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface/60 hover:bg-white/5 hover:text-on-surface transition-all duration-200">
              <span className="material-symbols-outlined">settings</span>
              <span className="text-sm">Settings</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface/60 hover:bg-white/5 hover:text-on-surface transition-all duration-200">
              <span className="material-symbols-outlined">contact_support</span>
              <span className="text-sm">Support</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
