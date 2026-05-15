"use client"

import { Header } from "@/components/header"
import { TransactionModal } from "@/components/transaction-modal"
import { CreditCardModal } from "@/components/credit-card-modal"
import { useFinanceStore, Transaction, CreditCard } from "@/store/use-finance-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FinancialInsights } from "@/components/financial-insights"
import Link from "next/link"

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function formatCurrency(value: number, decimals = 2) {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}

function CategoryIcon({ category, type }: { category: string | any; type: string }) {
  const iconMap: Record<string, string> = {
    alimentação: 'restaurant',
    mercado: 'shopping_cart',
    transporte: 'directions_car',
    saúde: 'health_and_safety',
    lazer: 'sports_esports',
    moradia: 'home',
    educação: 'school',
    assinatura: 'subscriptions',
    outros: 'receipt_long',
    salário: 'payments',
    freelance: 'work',
    investimento: 'trending_up',
  }
  const categoryName = typeof category === 'object' ? category?.name : (category || 'Outros')
  const key = categoryName?.toLowerCase()
  const icon = iconMap[key] || (type === 'income' ? 'add_circle' : 'remove_circle')
  return (
    <span className="material-symbols-rounded text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
      {icon}
    </span>
  )
}

export default function DashboardPage() {
  const {
    getBalance,
    transactions,
    cards,
    fetchTransactions,
    fetchAllTransactions,
    fetchCards,
    carriedOverBalance,
  } = useFinanceStore()
  const { isAuthenticated, checkAuth, isLoading: authLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1)
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [editingCard, setEditingCard] = useState<CreditCard | null>(null)

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!isAuthenticated) {
        router.push("/login")
      } else {
        fetchTransactions(currentMonth, currentYear)
        fetchAllTransactions()
        fetchCards()
      }
    }
  }, [mounted, authLoading, isAuthenticated, currentMonth, currentYear])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: 'rgba(60,221,199,0.3)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const balance = getBalance()
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0
  const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const navigateMonth = (dir: 1 | -1) => {
    if (dir === -1) {
      if (currentMonth === 1) { setCurrentMonth(12); setCurrentYear(y => y - 1) }
      else setCurrentMonth(m => m - 1)
    } else {
      if (currentMonth === 12) { setCurrentMonth(1); setCurrentYear(y => y + 1) }
      else setCurrentMonth(m => m + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

        {/* ── Hero Section ── */}
        <section className="pt-10 pb-10 flex flex-col items-center text-center gap-6">
          {/* Month selector */}
          <div
            className="inline-flex items-center rounded-2xl p-1 gap-1"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <button
              onClick={() => navigateMonth(-1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/8 active:scale-95"
              style={{ color: 'rgba(212,228,250,0.5)' }}
            >
              <span className="material-symbols-rounded text-[20px]">chevron_left</span>
            </button>

            <Popover>
              <PopoverTrigger render={
                <button
                  className="px-5 py-2 rounded-xl text-sm font-bold uppercase tracking-[0.1em] transition-all hover:bg-white/5"
                  style={{ color: '#d4e4fa', minWidth: 160 }}
                >
                  {MONTHS[currentMonth - 1]} {currentYear}
                </button>
              } />
              <PopoverContent
                className="w-64 p-3 rounded-2xl shadow-2xl"
                style={{
                  background: 'rgba(18,33,49,0.95)',
                  backdropFilter: 'blur(32px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.map((m, idx) => (
                    <button
                      key={m}
                      onClick={() => setCurrentMonth(idx + 1)}
                      className="h-9 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                      style={{
                        background: currentMonth === idx + 1 ? 'rgba(60,221,199,0.15)' : 'transparent',
                        color: currentMonth === idx + 1 ? '#3cddc7' : 'rgba(212,228,250,0.5)',
                        border: currentMonth === idx + 1 ? '1px solid rgba(60,221,199,0.3)' : '1px solid transparent',
                      }}
                    >
                      {m.substring(0, 3)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <button
                    onClick={() => setCurrentYear(y => y - 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/8"
                    style={{ color: 'rgba(212,228,250,0.5)' }}
                  >
                    <span className="material-symbols-rounded text-sm">remove</span>
                  </button>
                  <span className="text-sm font-bold" style={{ color: '#d4e4fa' }}>{currentYear}</span>
                  <button
                    onClick={() => setCurrentYear(y => y + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/8"
                    style={{ color: 'rgba(212,228,250,0.5)' }}
                  >
                    <span className="material-symbols-rounded text-sm">add</span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            <button
              onClick={() => navigateMonth(1)}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/8 active:scale-95"
              style={{ color: 'rgba(212,228,250,0.5)' }}
            >
              <span className="material-symbols-rounded text-[20px]">chevron_right</span>
            </button>
          </div>

          {/* Balance */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] mb-2" style={{ color: 'rgba(212,228,250,0.4)' }}>
              Saldo Projetado
            </p>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter tabular-nums"
              style={{ color: balance >= 0 ? '#d4e4fa' : '#ffb4ab' }}
            >
              R$ {formatCurrency(balance)}
            </h1>
            {carriedOverBalance !== 0 && (
              <p className="mt-2 text-xs" style={{ color: 'rgba(212,228,250,0.35)' }}>
                Saldo anterior: <span style={{ color: carriedOverBalance >= 0 ? '#3cddc7' : '#ffb4ab' }}>
                  R$ {formatCurrency(carriedOverBalance)}
                </span>
              </p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <TransactionModal type="income">
              <button className="btn-primary px-6">
                <span className="material-symbols-rounded text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
                Receita
              </button>
            </TransactionModal>
            <TransactionModal type="expense">
              <button
                className="btn-secondary px-6"
                style={{ borderColor: 'rgba(255,180,171,0.2)', color: '#ffb4ab' }}
              >
                <span className="material-symbols-rounded text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>remove_circle</span>
                Despesa
              </button>
            </TransactionModal>
          </div>
        </section>

        {/* ── Metric Cards ── */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {/* Receitas */}
          <div className="metric-card p-6 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(60,221,199,0.12)' }}
            >
              <span className="material-symbols-rounded text-[22px]" style={{ color: '#3cddc7', fontVariationSettings: "'FILL' 1" }}>
                trending_up
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(212,228,250,0.4)' }}>
                Receitas
              </p>
              <p className="text-xl font-black tabular-nums truncate" style={{ color: '#3cddc7' }}>
                R$ {formatCurrency(totalIncome, 0)}
              </p>
            </div>
          </div>

          {/* Despesas */}
          <div className="metric-card p-6 flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(255,180,171,0.1)' }}
            >
              <span className="material-symbols-rounded text-[22px]" style={{ color: '#ffb4ab', fontVariationSettings: "'FILL' 1" }}>
                trending_down
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(212,228,250,0.4)' }}>
                Despesas
              </p>
              <p className="text-xl font-black tabular-nums truncate" style={{ color: '#ffb4ab' }}>
                R$ {formatCurrency(totalExpense, 0)}
              </p>
            </div>
          </div>

          {/* Economia */}
          <div className="metric-card p-6 flex items-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                <circle
                  cx="24" cy="24" r="20"
                  fill="none"
                  stroke={savingsRate > 20 ? '#3cddc7' : '#ffb4ab'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={125.66}
                  strokeDashoffset={125.66 - (125.66 * Math.min(savingsRate, 100)) / 100}
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-black" style={{ color: savingsRate > 20 ? '#3cddc7' : '#ffb4ab' }}>
                  {savingsRate}%
                </span>
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1" style={{ color: 'rgba(212,228,250,0.4)' }}>
                Economia
              </p>
              <p className="text-base font-bold" style={{ color: savingsRate > 20 ? '#3cddc7' : '#ffb4ab' }}>
                {savingsRate > 20 ? 'Excelente' : savingsRate > 0 ? 'Pode melhorar' : 'Atenção!'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left: Transactions */}
          <div className="lg:col-span-8 space-y-6">

            {/* Statement */}
            <div className="glass-card">
              <div className="flex items-center justify-between p-6 pb-4">
                <div>
                  <h2 className="text-lg font-black tracking-tight" style={{ color: '#d4e4fa' }}>Extrato do Mês</h2>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(212,228,250,0.35)' }}>
                    {transactions.length} {transactions.length === 1 ? 'lançamento' : 'lançamentos'}
                  </p>
                </div>
                <Link
                  href="/history"
                  className="flex items-center gap-1 text-xs font-bold transition-all hover:opacity-100"
                  style={{ color: '#3cddc7', opacity: 0.8 }}
                >
                  Ver tudo
                  <span className="material-symbols-rounded text-[14px]">arrow_forward</span>
                </Link>
              </div>

              <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                {sortedTransactions.length > 0 ? sortedTransactions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setEditingTransaction(item)}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left transition-all duration-150 hover:bg-white/[0.03] group"
                  >
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{
                        background: item.type === 'income'
                          ? 'rgba(60,221,199,0.1)'
                          : 'rgba(255,255,255,0.05)',
                        color: item.type === 'income' ? '#3cddc7' : 'rgba(212,228,250,0.6)',
                      }}
                    >
                      <CategoryIcon category={item.category} type={item.type} />
                    </div>

                    {/* Description */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: '#d4e4fa' }}>
                        {item.description}
                      </p>
                      <p className="text-[11px] mt-0.5 flex items-center gap-1.5" style={{ color: 'rgba(212,228,250,0.35)' }}>
                        <span className="uppercase tracking-wide">
                          {(typeof item.category === 'object' ? item.category?.name : item.category) || 'Outros'}
                        </span>
                        <span>·</span>
                        <span>{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                        {item.creditCardId && (
                          <>
                            <span>·</span>
                            <span style={{ color: 'rgba(190,198,224,0.5)' }}>
                              {cards.find(c => c.id === item.creditCardId)?.name}
                            </span>
                          </>
                        )}
                        {item.totalInstallments && item.totalInstallments > 1 && (
                          <span
                            className="px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase"
                            style={{ background: 'rgba(190,198,224,0.08)', color: 'rgba(190,198,224,0.5)' }}
                          >
                            {item.currentInstallment}/{item.totalInstallments}x
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right flex-shrink-0">
                      <p
                        className="text-sm font-black tabular-nums"
                        style={{ color: item.type === 'income' ? '#3cddc7' : '#d4e4fa' }}
                      >
                        {item.type === 'income' ? '+' : '−'} R$ {formatCurrency(item.amount)}
                      </p>
                    </div>
                  </button>
                )) : (
                  <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                      <span className="material-symbols-rounded text-[28px]" style={{ color: 'rgba(212,228,250,0.2)' }}>
                        receipt_long
                      </span>
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'rgba(212,228,250,0.2)' }}>
                      Nenhum lançamento este mês
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-4 space-y-6">

            {/* Credit Cards */}
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-black tracking-tight" style={{ color: '#d4e4fa' }}>Carteira</h2>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(212,228,250,0.35)' }}>
                    {cards.length} {cards.length === 1 ? 'cartão' : 'cartões'}
                  </p>
                </div>
                <CreditCardModal>
                  <button
                    className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/8 active:scale-95"
                    style={{
                      background: 'rgba(60,221,199,0.1)',
                      border: '1px solid rgba(60,221,199,0.2)',
                      color: '#3cddc7',
                    }}
                  >
                    <span className="material-symbols-rounded text-[18px]">add</span>
                  </button>
                </CreditCardModal>
              </div>

              <div className="space-y-4">
                {cards.length > 0 ? cards.map((card, idx) => {
                  const gradients = [
                    'linear-gradient(135deg, rgba(60,221,199,0.15) 0%, rgba(40,168,150,0.06) 100%)',
                    'linear-gradient(135deg, rgba(190,198,224,0.12) 0%, rgba(141,149,176,0.05) 100%)',
                    'linear-gradient(135deg, rgba(255,180,171,0.12) 0%, rgba(200,120,113,0.05) 100%)',
                  ]
                  const accentColors = ['#3cddc7', '#bec6e0', '#ffb4ab']
                  const accent = accentColors[idx % accentColors.length]
                  const gradient = gradients[idx % gradients.length]

                  return (
                    <button
                      key={card.id}
                      onClick={() => setEditingCard(card)}
                      className="w-full text-left rounded-2xl p-5 transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] group"
                      style={{
                        background: gradient,
                        border: `1px solid rgba(255,255,255,0.07)`,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div
                          className="w-10 h-7 rounded-md flex items-center justify-center"
                          style={{ background: 'rgba(255,220,100,0.2)' }}
                        >
                          <div className="w-7 h-4 rounded-sm" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', opacity: 0.7 }} />
                        </div>
                        <span
                          className="material-symbols-rounded text-[16px] opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: accent }}
                        >
                          edit
                        </span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs font-bold mb-0.5" style={{ color: 'rgba(212,228,250,0.35)' }}>
                            {card.bankName || card.name}
                          </p>
                          <p className="text-sm font-black" style={{ color: '#d4e4fa' }}>{card.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(212,228,250,0.3)' }}>
                            Limite
                          </p>
                          <p className="text-sm font-black" style={{ color: accent }}>
                            R$ {formatCurrency(card.limit, 0)}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <span className="text-[10px]" style={{ color: 'rgba(212,228,250,0.3)' }}>
                          Vence dia <span className="font-bold" style={{ color: 'rgba(212,228,250,0.6)' }}>{card.dueDay}</span>
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: accent }}>
                          ativo
                        </span>
                      </div>
                    </button>
                  )
                }) : (
                  <button
                    className="w-full h-36 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:bg-white/[0.02]"
                    style={{
                      border: '2px dashed rgba(255,255,255,0.07)',
                      color: 'rgba(212,228,250,0.2)',
                    }}
                    onClick={() => {}}
                  >
                    <span className="material-symbols-rounded text-[28px]">add_card</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Adicionar cartão</span>
                  </button>
                )}
              </div>
            </div>

            {/* Financial Health */}
            <div
              className="rounded-3xl p-6 overflow-hidden relative"
              style={{
                background: 'linear-gradient(135deg, rgba(60,221,199,0.12) 0%, rgba(40,168,150,0.06) 100%)',
                border: '1px solid rgba(60,221,199,0.15)',
                boxShadow: '0 8px 32px rgba(60,221,199,0.08)',
              }}
            >
              {/* Decorative glow */}
              <div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full"
                style={{ background: 'rgba(60,221,199,0.08)', filter: 'blur(32px)' }}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h2 className="text-base font-black" style={{ color: '#d4e4fa' }}>Saúde Financeira</h2>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(212,228,250,0.4)' }}>Taxa de economia do mês</p>
                  </div>
                  <span
                    className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
                    style={{
                      background: savingsRate > 20 ? 'rgba(60,221,199,0.15)' : 'rgba(255,180,171,0.12)',
                      color: savingsRate > 20 ? '#3cddc7' : '#ffb4ab',
                    }}
                  >
                    {savingsRate > 20 ? '✓ Ótimo' : 'Atenção'}
                  </span>
                </div>

                <div className="flex items-center gap-5">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="34"
                        fill="none"
                        stroke={savingsRate > 20 ? '#3cddc7' : '#ffb4ab'}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={213.63}
                        strokeDashoffset={213.63 - (213.63 * Math.min(savingsRate, 100)) / 100}
                        style={{ transition: 'stroke-dashoffset 1.2s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span
                        className="text-lg font-black tabular-nums"
                        style={{ color: savingsRate > 20 ? '#3cddc7' : '#ffb4ab' }}
                      >
                        {savingsRate}%
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'rgba(212,228,250,0.4)' }}>Receitas</span>
                      <span className="font-bold" style={{ color: '#d4e4fa' }}>R$ {formatCurrency(totalIncome, 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'rgba(212,228,250,0.4)' }}>Despesas</span>
                      <span className="font-bold" style={{ color: '#d4e4fa' }}>R$ {formatCurrency(totalExpense, 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'rgba(212,228,250,0.4)' }}>Poupado</span>
                      <span className="font-bold" style={{ color: '#3cddc7' }}>R$ {formatCurrency(Math.max(0, totalIncome - totalExpense), 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Insights Section ── */}
        <section className="mt-12">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(190,198,224,0.08)' }}
            >
              <span className="material-symbols-rounded text-[20px]" style={{ color: '#bec6e0', fontVariationSettings: "'FILL' 1" }}>
                insights
              </span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight" style={{ color: '#d4e4fa' }}>Análises</h2>
              <p className="text-xs" style={{ color: 'rgba(212,228,250,0.35)' }}>Desempenho financeiro detalhado</p>
            </div>
          </div>
          <FinancialInsights />
        </section>
      </main>

      {/* Edit modals */}
      {editingTransaction && (
        <TransactionModal
          open={!!editingTransaction}
          onOpenChange={(open) => !open && setEditingTransaction(null)}
          type={editingTransaction.type}
          initialData={editingTransaction}
        />
      )}
      {editingCard && (
        <CreditCardModal
          open={!!editingCard}
          onOpenChange={(open) => !open && setEditingCard(null)}
          initialData={editingCard}
        />
      )}
    </div>
  )
}
