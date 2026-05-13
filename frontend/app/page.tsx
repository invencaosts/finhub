"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { GlassCard } from "@/components/glass-card"
import { TransactionModal } from "@/components/transaction-modal"
import { CreditCardModal } from "@/components/credit-card-modal"
import { useFinanceStore } from "@/store/use-finance-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { getBalance, transactions, cards, fetchTransactions, fetchCards } = useFinanceStore()
  const { isAuthenticated, checkAuth, isLoading: authLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  // Authentication & Initial Data Fetching
  useEffect(() => {
    setMounted(true)
    const init = async () => {
      await checkAuth()
    }
    init()
  }, [])

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else {
        fetchTransactions()
        fetchCards()
      }
    }
  }, [mounted, authLoading, isAuthenticated])

  if (!mounted || authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 rounded-full border-4 border-tertiary border-t-transparent animate-spin"></div>
    </div>
  )

  const balance = getBalance()
  const latestTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <Sidebar />
      
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen">
        <Header />
        
        <div className="p-8 flex-1">
          {/* Hero / Saldo Atual */}
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-xs uppercase text-secondary/60 tracking-wider mb-2 font-bold">Visão Geral</h2>
              <p className="text-sm text-on-surface/60 mb-1">Saldo Atual</p>
              <h1 className="text-5xl text-on-surface glow-text tracking-tight font-black">
                R$ {balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h1>
              <div className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20">
                <span className="material-symbols-outlined text-[14px] text-tertiary">trending_up</span>
                <span className="text-xs text-tertiary font-semibold">+2.4% este mês</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <TransactionModal type="expense">
                <button className="glass-button-secondary px-6 py-3 rounded-xl text-sm font-semibold text-on-surface flex items-center gap-2 hover:border-error/50 transition-colors group">
                  <span className="material-symbols-outlined text-error text-xl group-hover:scale-110 transition-transform">remove</span>
                  Despesa
                </button>
              </TransactionModal>
              
              <TransactionModal type="income">
                <button className="bg-gradient-to-r from-tertiary to-tertiary/80 text-on-tertiary px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 shadow-[0_4px_15px_rgba(60,221,199,0.2)] hover:shadow-[0_6px_20px_rgba(60,221,199,0.3)] transition-all group">
                  <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform">add</span>
                  Renda
                </button>
              </TransactionModal>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <GlassCard className="h-96 flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-on-surface">Gráfico de Gastos</h3>
                    <p className="text-sm text-on-surface/60 mt-1">Análise por categoria este mês</p>
                  </div>
                  <button className="text-on-surface/40 hover:text-on-surface transition-colors">
                    <span className="material-symbols-outlined">more_horiz</span>
                  </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                   <div className="relative w-48 h-48 rounded-full border-8 border-tertiary/20 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-8 border-tertiary border-t-transparent"></div>
                      <div className="text-center">
                        <span className="text-xs uppercase text-on-surface/40 font-bold block">Gastos</span>
                        <span className="text-2xl font-black text-on-surface">
                          R$ {transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                   </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-on-surface">Últimas Transações</h3>
                  <button className="text-xs text-tertiary hover:text-tertiary/80 transition-colors uppercase font-bold tracking-widest">
                    Ver Todas
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {latestTransactions.length > 0 ? latestTransactions.map((item) => (
                    <div key={item.id} className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'income' ? 'bg-tertiary/20 text-tertiary' : 'bg-error/20 text-error'}`}>
                          <span className="material-symbols-outlined">
                            {item.type === 'income' ? 'trending_up' : 'trending_down'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface/40 uppercase tracking-tighter">
                          {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface group-hover:text-tertiary transition-colors truncate">{item.description}</p>
                        <p className="text-xs text-on-surface/60">
                          R$ {item.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-3 py-10 text-center text-on-surface/40 border-2 border-dashed border-white/5 rounded-xl">
                      Nenhuma transação registrada.
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <GlassCard className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-on-surface">Cartões</h3>
                  <CreditCardModal>
                    <button className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-on-surface/40 hover:text-tertiary hover:border-tertiary/50 transition-all">
                      <span className="material-symbols-outlined text-lg">add</span>
                    </button>
                  </CreditCardModal>
                </div>
                
                {cards.length > 0 ? (
                  <div className="space-y-4">
                    {cards.map(card => (
                      <div key={card.id} className="relative h-44 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 p-5 flex flex-col justify-between overflow-hidden group">
                        <div className="flex justify-between items-start relative z-10">
                          <span className="text-lg font-black italic tracking-tighter text-on-surface opacity-80">{card.name.toUpperCase()}</span>
                          <span className="material-symbols-outlined text-on-surface/40">contactless</span>
                        </div>
                        <div className="relative z-10">
                          <p className="text-md font-medium tracking-[0.2em] text-on-surface mb-2">•••• •••• •••• {Math.floor(Math.random() * 9000) + 1000}</p>
                          <div className="flex justify-between items-end">
                            <span className="text-[10px] text-on-surface/40 font-bold">VENCE DIA {card.dueDay}</span>
                            <span className="text-xs font-bold text-tertiary">R$ {card.limit.toLocaleString('pt-BR')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative h-48 rounded-2xl bg-white/5 border border-dashed border-white/10 flex flex-col items-center justify-center text-on-surface/40">
                     <span className="material-symbols-outlined text-4xl mb-2">credit_card</span>
                     <p className="text-xs font-bold uppercase">Nenhum cartão</p>
                  </div>
                )}

                <div className="mt-auto pt-8 space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-xs font-bold text-on-surface/40 uppercase">Limite Total</p>
                      <p className="text-xs font-bold text-on-surface">
                        R$ {cards.reduce((acc, c) => acc + c.limit, 0).toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-tertiary to-primary w-[40%] rounded-full"></div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
