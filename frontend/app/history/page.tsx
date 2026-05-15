"use client"

import { Header } from "@/components/header"
import { useFinanceStore } from "@/store/use-finance-store"
import { useAuthStore } from "@/store/use-auth-store"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const glassStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 100%)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
  borderRadius: '1.5rem',
  overflow: 'hidden' as const,
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: '2.5rem',
  borderRadius: '0.75rem',
  padding: '0 0.875rem',
  fontSize: '0.8125rem',
  color: '#d4e4fa',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  outline: 'none',
  transition: 'border-color 0.2s',
}

export default function HistoryPage() {
  const { transactions, fetchTransactions } = useFinanceStore()
  const { isAuthenticated, checkAuth, isLoading: authLoading } = useAuthStore()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterDay, setFilterDay] = useState("")
  const [filterMonth, setFilterMonth] = useState("all")
  const [filterYear, setFilterYear] = useState("all")

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  useEffect(() => {
    setMounted(true)
    checkAuth()
  }, [])

  useEffect(() => {
    if (mounted && !authLoading) {
      if (!isAuthenticated) router.push("/login")
      else fetchTransactions()
    }
  }, [mounted, authLoading, isAuthenticated])

  if (!mounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div
          className="w-12 h-12 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(60,221,199,0.3)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  const filtered = transactions.filter(t => {
    const d = new Date(t.date)
    const categoryName = (typeof t.category === 'object' ? t.category?.name : t.category) || 'Outros'
    
    return (
      (t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (categoryName && categoryName.toLowerCase().includes(searchTerm.toLowerCase()))) &&
      (filterDay === "" || d.getDate() === parseInt(filterDay)) &&
      (filterMonth === "all" || d.getMonth() + 1 === parseInt(filterMonth)) &&
      (filterYear === "all" || d.getFullYear() === parseInt(filterYear))
    )
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold mb-3 transition-all"
              style={{ color: 'rgba(212,228,250,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#3cddc7')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,228,250,0.4)')}
            >
              <span className="material-symbols-rounded text-[14px]">arrow_back</span>
              Dashboard
            </Link>
            <h1 className="text-3xl font-black tracking-tight" style={{ color: '#d4e4fa' }}>Histórico Completo</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(212,228,250,0.35)' }}>
              {filtered.length} {filtered.length === 1 ? 'transação encontrada' : 'transações encontradas'}
            </p>
          </div>

          {/* Summary chips */}
          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(60,221,199,0.08)', border: '1px solid rgba(60,221,199,0.15)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(60,221,199,0.6)' }}>Entradas</p>
              <p className="text-sm font-black tabular-nums" style={{ color: '#3cddc7' }}>
                R$ {totalIncome.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="px-4 py-2 rounded-xl" style={{ background: 'rgba(255,180,171,0.08)', border: '1px solid rgba(255,180,171,0.15)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: 'rgba(255,180,171,0.6)' }}>Saídas</p>
              <p className="text-sm font-black tabular-nums" style={{ color: '#ffb4ab' }}>
                R$ {totalExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={glassStyle}>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(212,228,250,0.35)' }}>
                Buscar
              </label>
              <div className="relative">
                <span
                  className="material-symbols-rounded text-[16px] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: 'rgba(212,228,250,0.3)' }}
                >
                  search
                </span>
                <input
                  type="text"
                  placeholder="Descrição ou categoria…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: '2.25rem' }}
                  onFocus={e => { e.currentTarget.style.borderColor = 'rgba(60,221,199,0.5)' }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                />
              </div>
            </div>

            {/* Day */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(212,228,250,0.35)' }}>
                Dia
              </label>
              <input
                type="number"
                placeholder="Ex: 05"
                min="1" max="31"
                value={filterDay}
                onChange={e => setFilterDay(e.target.value)}
                style={inputStyle}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(60,221,199,0.5)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              />
            </div>

            {/* Month */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(212,228,250,0.35)' }}>
                Mês
              </label>
              <select
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(60,221,199,0.5)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <option value="all" style={{ background: '#122131' }}>Todos os meses</option>
                {MONTHS.map((m, i) => (
                  <option key={m} value={(i + 1).toString()} style={{ background: '#122131' }}>{m}</option>
                ))}
              </select>
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em]" style={{ color: 'rgba(212,228,250,0.35)' }}>
                Ano
              </label>
              <select
                value={filterYear}
                onChange={e => setFilterYear(e.target.value)}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(60,221,199,0.5)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <option value="all" style={{ background: '#122131' }}>Todos os anos</option>
                {years.map(y => (
                  <option key={y} value={y.toString()} style={{ background: '#122131' }}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={glassStyle}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  {['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor'].map((h, i) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.12em] whitespace-nowrap"
                      style={{
                        color: 'rgba(212,228,250,0.35)',
                        textAlign: i === 4 ? 'right' : 'left',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, idx) => (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-xs" style={{ color: 'rgba(212,228,250,0.45)' }}>
                      {new Date(t.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold" style={{ color: '#d4e4fa' }}>{t.description}</p>
                      {t.totalInstallments && t.totalInstallments > 1 && (
                        <p className="text-[10px] mt-0.5" style={{ color: 'rgba(212,228,250,0.3)' }}>
                          Parcela {t.currentInstallment} de {t.totalInstallments}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          color: 'rgba(212,228,250,0.5)',
                        }}
                      >
                        {(typeof t.category === 'object' ? t.category?.name : t.category) || 'Outros'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide"
                        style={{
                          background: t.type === 'income' ? 'rgba(60,221,199,0.1)' : 'rgba(255,180,171,0.1)',
                          color: t.type === 'income' ? '#3cddc7' : '#ffb4ab',
                        }}
                      >
                        <span className="material-symbols-rounded text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {t.type === 'income' ? 'arrow_upward' : 'arrow_downward'}
                        </span>
                        {t.type === 'income' ? 'Entrada' : 'Saída'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span
                        className="text-sm font-black tabular-nums"
                        style={{ color: t.type === 'income' ? '#3cddc7' : '#d4e4fa' }}
                      >
                        {t.type === 'income' ? '+' : '−'} R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5}>
                      <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <span className="material-symbols-rounded text-[40px]" style={{ color: 'rgba(212,228,250,0.12)' }}>
                          search_off
                        </span>
                        <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'rgba(212,228,250,0.2)' }}>
                          Nenhuma transação encontrada
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
