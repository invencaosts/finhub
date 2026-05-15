"use client"

import { useFinanceStore } from "@/store/use-finance-store"
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar,
} from 'recharts'
import { useMemo } from "react"

const CATEGORY_COLORS = [
  '#3cddc7', '#bec6e0', '#ffb4ab', '#6ee7df', '#91aed4',
  '#ffd9d6', '#28c4b0', '#9aa8c0', '#e8a09a',
]

const glassStyle = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.065) 0%, rgba(255,255,255,0.02) 100%)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  border: '1px solid rgba(255,255,255,0.08)',
  boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
  borderRadius: '1.5rem',
  overflow: 'hidden' as const,
}

function SectionTitle({ icon, title, subtitle }: { icon: string; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <span className="material-symbols-rounded text-[18px]" style={{ color: '#bec6e0', fontVariationSettings: "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <div>
        <h3 className="text-sm font-black" style={{ color: '#d4e4fa' }}>{title}</h3>
        {subtitle && <p className="text-[10px] mt-0.5" style={{ color: 'rgba(212,228,250,0.35)' }}>{subtitle}</p>}
      </div>
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="px-3 py-2 rounded-xl text-xs"
      style={{
        background: 'rgba(18,33,49,0.98)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      {label && <p className="font-bold mb-1.5" style={{ color: 'rgba(212,228,250,0.5)' }}>{label}</p>}
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color || entry.fill }} />
          <span style={{ color: '#d4e4fa' }}>
            {entry.name}: <span className="font-bold">R$ {Number(entry.value).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
          </span>
        </div>
      ))}
    </div>
  )
}

export function FinancialInsights() {
  const { allTransactions, transactions } = useFinanceStore()

  const categoryData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense')
    const grouped = expenses.reduce((acc, t) => {
      const catName = typeof t.category === 'object' ? (t.category as any)?.name : (t.category || "Outros")
      acc[catName] = (acc[catName] || 0) + t.amount
      return acc
    }, {} as Record<string, number>)
    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const trendData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const map: Record<string, { month: string; income: number; expense: number; key: string }> = {}
    const sorted = [...allTransactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    sorted.forEach(t => {
      const d = new Date(t.date)
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`
      if (!map[key]) {
        map[key] = { month: `${months[d.getMonth()]}/${d.getFullYear().toString().slice(-2)}`, income: 0, expense: 0, key }
      }
      if (t.type === 'income') map[key].income += t.amount
      else map[key].expense += t.amount
    })

    return Object.values(map).slice(-6)
  }, [allTransactions])

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const savingsRate = totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0
  const topExpenses = transactions.filter(t => t.type === 'expense').sort((a, b) => b.amount - a.amount).slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

      {/* Evolução mensal — wide */}
      <div className="lg:col-span-7" style={glassStyle}>
        <div className="p-6">
          <SectionTitle icon="query_stats" title="Evolução Financeira" subtitle="Entradas vs. Saídas — últimos 6 meses" />
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} barGap={6} barCategoryGap="30%">
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3cddc7" stopOpacity={1} />
                    <stop offset="100%" stopColor="#3cddc7" stopOpacity={0.5} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffb4ab" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ffb4ab" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(212,228,250,0.3)', fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'rgba(212,228,250,0.3)', fontSize: 10 }}
                  tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
                  width={48}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }} />
                <Bar dataKey="income" name="Receitas" fill="url(#incomeGrad)" radius={[6, 6, 2, 2]} maxBarSize={40} />
                <Bar dataKey="expense" name="Despesas" fill="url(#expenseGrad)" radius={[6, 6, 2, 2]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#3cddc7' }} />
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(212,228,250,0.4)' }}>Receitas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#ffb4ab' }} />
              <span className="text-[11px] font-semibold" style={{ color: 'rgba(212,228,250,0.4)' }}>Despesas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gastos por categoria */}
      <div className="lg:col-span-5" style={glassStyle}>
        <div className="p-6 h-full flex flex-col">
          <SectionTitle icon="pie_chart" title="Gastos por Categoria" subtitle="Mês atual" />

          {categoryData.length > 0 ? (
            <>
              <div className="h-52 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 space-y-2 flex-1 overflow-hidden">
                {categoryData.slice(0, 4).map((entry, i) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                      <span className="text-xs truncate" style={{ color: 'rgba(212,228,250,0.55)' }}>{entry.name}</span>
                    </div>
                    <span className="text-xs font-bold flex-shrink-0 ml-2" style={{ color: '#d4e4fa' }}>
                      R$ {entry.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-rounded text-[36px]" style={{ color: 'rgba(212,228,250,0.12)' }}>pie_chart</span>
              <p className="text-xs" style={{ color: 'rgba(212,228,250,0.2)' }}>Sem despesas registradas</p>
            </div>
          )}
        </div>
      </div>

      {/* Maiores gastos */}
      <div className="lg:col-span-5" style={glassStyle}>
        <div className="p-6">
          <SectionTitle icon="receipt_long" title="Maiores Gastos" subtitle="Top 5 do mês atual" />
          <div className="space-y-3">
            {topExpenses.length > 0 ? topExpenses.map((t, idx) => {
              const maxAmount = topExpenses[0].amount
              const pct = Math.round((t.amount / maxAmount) * 100)
              return (
                <div key={t.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black flex-shrink-0"
                        style={{ background: 'rgba(255,180,171,0.12)', color: '#ffb4ab' }}
                      >
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold truncate" style={{ color: '#d4e4fa' }}>{t.description}</p>
                        <p className="text-[10px] uppercase tracking-wide" style={{ color: 'rgba(212,228,250,0.3)' }}>{t.category}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black flex-shrink-0 ml-3" style={{ color: '#d4e4fa' }}>
                      R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, rgba(255,180,171,${0.4 + idx * 0.12}) 0%, rgba(255,180,171,0.8) 100%)`,
                      }}
                    />
                  </div>
                </div>
              )
            }) : (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <span className="material-symbols-rounded text-[32px]" style={{ color: 'rgba(212,228,250,0.12)' }}>
                  receipt_long
                </span>
                <p className="text-xs" style={{ color: 'rgba(212,228,250,0.2)' }}>Sem gastos registrados</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health score */}
      <div className="lg:col-span-7" style={glassStyle}>
        <div className="p-6">
          <SectionTitle icon="analytics" title="Saúde Financeira Detalhada" subtitle="Análise completa do mês" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: 'Taxa de Economia',
                value: `${Math.round(savingsRate)}%`,
                sub: savingsRate > 20 ? 'Excelente! Continue assim.' : savingsRate > 0 ? 'Pode melhorar.' : 'Atenção: gastou mais que ganhou.',
                color: savingsRate > 20 ? '#3cddc7' : '#ffb4ab',
                bg: savingsRate > 20 ? 'rgba(60,221,199,0.07)' : 'rgba(255,180,171,0.07)',
              },
              {
                label: 'Total Ganhos',
                value: `R$ ${totalIncome.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`,
                sub: 'Entradas do mês',
                color: '#3cddc7',
                bg: 'rgba(60,221,199,0.06)',
              },
              {
                label: 'Total Gasto',
                value: `R$ ${totalExpense.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`,
                sub: 'Saídas do mês',
                color: '#ffb4ab',
                bg: 'rgba(255,180,171,0.06)',
              },
            ].map(({ label, value, sub, color, bg }) => (
              <div key={label} className="rounded-2xl p-4" style={{ background: bg, border: '1px solid rgba(255,255,255,0.05)' }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: 'rgba(212,228,250,0.35)' }}>
                  {label}
                </p>
                <p className="text-2xl font-black tabular-nums mb-1" style={{ color }}>{value}</p>
                <p className="text-[11px]" style={{ color: 'rgba(212,228,250,0.35)' }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          {totalIncome > 0 && (
            <div className="mt-6">
              <div className="flex justify-between text-[10px] font-bold mb-2" style={{ color: 'rgba(212,228,250,0.35)' }}>
                <span>Gastos ({Math.round((totalExpense / totalIncome) * 100)}%)</span>
                <span>Poupado ({Math.round(savingsRate)}%)</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: `${Math.min((totalExpense / totalIncome) * 100, 100)}%`,
                    background: `linear-gradient(90deg, #ffb4ab 0%, rgba(255,180,171,0.6) 100%)`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
