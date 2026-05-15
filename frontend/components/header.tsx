import { ProfileMenu } from './profile-menu'
import Link from 'next/link'

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'linear-gradient(180deg, rgba(5,20,36,0.85) 0%, rgba(5,20,36,0) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3cddc7 0%, #28a896 100%)',
              boxShadow: '0 4px 16px rgba(60,221,199,0.3)',
            }}
          >
            <span className="material-symbols-rounded text-[18px] font-black" style={{ color: '#003731', fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <div className="leading-none">
            <span className="block text-base font-black tracking-tight text-on-surface">FinHub</span>
            <span className="block text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: '#3cddc7' }}>
              Finance
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/history"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/5"
            style={{ color: 'rgba(212,228,250,0.55)' }}
          >
            <span className="material-symbols-rounded text-[18px]" style={{ fontVariationSettings: "'FILL' 0" }}>
              history
            </span>
            <span className="hidden sm:inline" style={{ color: 'rgba(212,228,250,0.55)' }}>Histórico</span>
          </Link>

          <div className="w-px h-5 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />

          <ProfileMenu />
        </nav>
      </div>
    </header>
  )
}
