"use client"

import { GlassCard } from "@/components/glass-card"
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
      setError(err.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>
      
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-tertiary to-primary flex items-center justify-center shadow-[0_0_20px_rgba(60,221,199,0.3)]">
              <span className="font-bold text-lg text-on-tertiary">A</span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-black text-on-surface tracking-tight leading-none">AURA</h1>
              <span className="text-xs uppercase tracking-[0.2em] text-tertiary font-bold">FINANCE</span>
            </div>
          </div>
          <p className="text-on-surface/60 text-sm">Bem-vindo de volta ao futuro das suas finanças.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="seu@email.com" 
              className="bg-white/5 border-white/10 h-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Senha</Label>
              <Link href="#" className="text-xs text-tertiary hover:underline">Esqueceu a senha?</Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              className="bg-white/5 border-white/10 h-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-tertiary to-tertiary/80 text-on-tertiary font-bold text-md shadow-[0_4px_20px_rgba(60,221,199,0.3)] hover:shadow-[0_6px_25px_rgba(60,221,199,0.4)] transition-all disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface/60">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-tertiary font-bold hover:underline">
              Crie agora
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
