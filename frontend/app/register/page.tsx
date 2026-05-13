"use client"

import { GlassCard } from "@/components/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useAuthStore } from "@/store/use-auth-store"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const register = useAuthStore((state) => state.register)
  const isLoading = useAuthStore((state) => state.isLoading)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    try {
      await register({ fullName, email, password })
      router.push("/")
    } catch (err: any) {
      const message = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Erro ao criar conta."
      setError(message)
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
          <p className="text-on-surface/60 text-sm">Comece sua jornada para a liberdade financeira.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-error/10 border border-error/20 text-error text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input 
              id="name" 
              placeholder="Como quer ser chamado?" 
              className="bg-white/5 border-white/10 h-12"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

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
            <Label htmlFor="password">Senha</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Mínimo 8 caracteres"
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
            {isLoading ? "Criando..." : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-on-surface/60">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-tertiary font-bold hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
