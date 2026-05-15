"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login({ email, password })
      router.push("/")
    } catch (err: any) {
      setError(err.response?.data?.message || "Credenciais inválidas. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel — brand (hidden on mobile) */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-14 relative overflow-hidden"
        style={{
          background: 'linear-gradient(145deg, rgba(18,33,49,0.9) 0%, rgba(5,20,36,1) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {/* Decorative orbs */}
        <div
          className="absolute top-[-80px] left-[-80px] w-[420px] h-[420px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(60,221,199,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute bottom-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(190,198,224,0.1) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #3cddc7 0%, #28a896 100%)',
              boxShadow: '0 4px 16px rgba(60,221,199,0.3)',
            }}
          >
            <span className="material-symbols-rounded text-[20px]" style={{ color: '#003731', fontVariationSettings: "'FILL' 1" }}>
              account_balance_wallet
            </span>
          </div>
          <div className="leading-none">
            <span className="block text-lg font-black tracking-tight" style={{ color: '#d4e4fa' }}>FinHub</span>
            <span className="block text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: '#3cddc7' }}>Finance</span>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-black tracking-tight leading-tight mb-4" style={{ color: '#d4e4fa' }}>
              Controle total<br />
              <span style={{ color: '#3cddc7' }}>das suas finanças.</span>
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(212,228,250,0.45)' }}>
              Visualize entradas, saídas e cartões de crédito em um painel elegante e intuitivo. Tome decisões financeiras com clareza.
            </p>
          </div>

          {/* Feature list */}
          <div className="space-y-3">
            {[
              { icon: 'insights', label: 'Análises financeiras em tempo real' },
              { icon: 'credit_card', label: 'Gestão de múltiplos cartões' },
              { icon: 'calendar_month', label: 'Visão mês a mês completa' },
            ].map(({ icon, label }) => (
              <div key={icon} className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(60,221,199,0.1)', border: '1px solid rgba(60,221,199,0.15)' }}
                >
                  <span className="material-symbols-rounded text-[16px]" style={{ color: '#3cddc7', fontVariationSettings: "'FILL' 1" }}>
                    {icon}
                  </span>
                </div>
                <span className="text-sm font-semibold" style={{ color: 'rgba(212,228,250,0.6)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <p className="relative z-10 text-[11px]" style={{ color: 'rgba(212,228,250,0.2)' }}>
          © 2026 FinHub Finance. Uso pessoal.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 justify-center">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #3cddc7 0%, #28a896 100%)',
                boxShadow: '0 4px 16px rgba(60,221,199,0.3)',
              }}
            >
              <span className="material-symbols-rounded text-[20px]" style={{ color: '#003731', fontVariationSettings: "'FILL' 1" }}>
                account_balance_wallet
              </span>
            </div>
            <div className="leading-none">
              <span className="block text-lg font-black tracking-tight" style={{ color: '#d4e4fa' }}>FinHub</span>
              <span className="block text-[9px] font-bold tracking-[0.18em] uppercase" style={{ color: '#3cddc7' }}>Finance</span>
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-black tracking-tight mb-1" style={{ color: '#d4e4fa' }}>
              Bem-vindo de volta
            </h1>
            <p className="text-sm" style={{ color: 'rgba(212,228,250,0.4)' }}>
              Entre na sua conta para continuar.
            </p>
          </div>

          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm"
              style={{
                background: 'rgba(255,180,171,0.08)',
                border: '1px solid rgba(255,180,171,0.2)',
                color: '#ffb4ab',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'rgba(212,228,250,0.4)' }}>
                E-mail
              </label>
              <input
                type="email"
                placeholder="seu@email.com"
                className="input-standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'rgba(212,228,250,0.4)' }}>
                  Senha
                </label>
                <Link href="#" className="text-[11px] font-semibold" style={{ color: '#3cddc7' }}>
                  Esqueceu?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="input-standard"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2"
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? (
                <>
                  <div
                    className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'rgba(0,55,49,0.4)', borderTopColor: 'transparent' }}
                  />
                  Entrando…
                </>
              ) : 'Entrar na conta'}
            </button>
          </form>

          <p className="text-center text-sm" style={{ color: 'rgba(212,228,250,0.35)' }}>
            Não tem uma conta?{' '}
            <Link href="/register" className="font-bold" style={{ color: '#3cddc7' }}>
              Criar agora
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
