import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import api from '@/lib/api'

export type Transaction = {
  id: string | number
  description: string
  amount: number
  type: 'income' | 'expense'
  category?: string | any
  date: string
  creditCardId?: number | null
  bankName?: string
  totalInstallments?: number
  currentInstallment?: number
  categoryId?: number
  isRecurring?: boolean
  frequency?: string
  recurrenceEndAt?: string
  parentId?: string
  recurrenceMode?: 'fixed' | 'installment'
}

export type CreditCard = {
  id: string | number
  name: string
  limit: number
  dueDay: number
  bankName?: string
}

interface FinanceState {
  transactions: Transaction[]
  allTransactions: Transaction[]
  cards: CreditCard[]
  incomeGoal: number
  carriedOverBalance: number
  isLoading: boolean
  
  fetchTransactions: (month?: number, year?: number) => Promise<void>
  fetchAllTransactions: () => Promise<void>
  fetchCards: () => Promise<void>
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>
  updateTransaction: (id: string | number, transaction: Partial<Transaction>) => Promise<void>
  removeTransaction: (id: string | number, deleteAll?: boolean) => Promise<void>
  addCard: (card: Omit<CreditCard, 'id'>) => Promise<void>
  updateCard: (id: string | number, card: Partial<CreditCard>) => Promise<void>
  removeCard: (id: string | number) => Promise<void>
  setIncomeGoal: (goal: number) => void
  
  getTotalIncome: () => number
  getTotalExpenses: () => number
  getBalance: () => number
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      transactions: [],
      allTransactions: [],
      cards: [],
      incomeGoal: 0,
      carriedOverBalance: 0,
      isLoading: false,

      fetchTransactions: async (month, year) => {
        set({ isLoading: true })
        try {
          const params = month && year ? { month, year } : {}
          const response = await api.get('/transactions', { params })
          const data = response.data.transactions.map((t: any) => ({
            ...t,
            amount: parseFloat(t.amount)
          }))
          set({ 
            transactions: data, 
            carriedOverBalance: parseFloat(response.data.carriedOverBalance || 0),
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          console.error('Error fetching transactions:', error)
        }
      },

      fetchAllTransactions: async () => {
        set({ isLoading: true })
        try {
          const response = await api.get('/transactions')
          const data = response.data.transactions.map((t: any) => ({
            ...t,
            amount: parseFloat(t.amount)
          }))
          set({ 
            allTransactions: data,
            isLoading: false 
          })
        } catch (error) {
          set({ isLoading: false })
          console.error('Error fetching all transactions:', error)
        }
      },

      fetchCards: async () => {
        try {
          const response = await api.get('/credit-cards')
          const data = response.data.map((c: any) => ({
            ...c,
            limit: parseFloat(c.limit)
          }))
          set({ cards: data })
        } catch (error) {
          console.error('Error fetching cards:', error)
        }
      },

      addTransaction: async (transaction) => {
        const tempId = `temp-${Date.now()}`
        const newTransaction = { ...transaction, id: tempId }
        
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
        }))

        try {
          const response = await api.post('/transactions', transaction)
          const savedTransaction = { 
            ...response.data, 
            amount: parseFloat(response.data.amount) 
          }
          
          set((state) => ({
            transactions: state.transactions.map((t) => 
              t.id === tempId ? savedTransaction : t
            ),
          }))
        } catch (error) {
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== tempId),
          }))
          throw error
        }
      },

      updateTransaction: async (id, transaction) => {
        const previousTransactions = get().transactions
        set((state) => ({
          transactions: state.transactions.map((t) => 
            t.id === id ? { ...t, ...transaction } : t
          ),
        }))

        try {
          const response = await api.put(`/transactions/${id}`, transaction)
          const updatedTransaction = { 
            ...response.data, 
            amount: parseFloat(response.data.amount) 
          }
          
          set((state) => ({
            transactions: state.transactions.map((t) => 
              t.id === id ? updatedTransaction : t
            ),
          }))
        } catch (error) {
          set({ transactions: previousTransactions })
          throw error
        }
      },

      removeTransaction: async (id, deleteAll = false) => {
        const previousTransactions = get().transactions
        set((state) => ({
          transactions: deleteAll 
            ? state.transactions.filter((t) => t.id !== id && t.parentId !== id && t.parentId !== (previousTransactions.find(x => x.id === id)?.parentId))
            : state.transactions.filter((t) => t.id !== id),
        }))

        try {
          await api.delete(`/transactions/${id}`, { params: { deleteAll } })
        } catch (error) {
          set({ transactions: previousTransactions })
          throw error
        }
      },

      addCard: async (card) => {
        const tempId = `temp-card-${Date.now()}`
        const newCard = { ...card, id: tempId }
        
        set((state) => ({
          cards: [...state.cards, newCard],
        }))

        try {
          const response = await api.post('/credit-cards', card)
          const savedCard = { 
            ...response.data, 
            limit: parseFloat(response.data.limit) 
          }
          
          set((state) => ({
            cards: state.cards.map((c) => 
              c.id === tempId ? savedCard : c
            ),
          }))
        } catch (error) {
          set((state) => ({
            cards: state.cards.filter((c) => c.id !== tempId),
          }))
          throw error
        }
      },

      updateCard: async (id, card) => {
        const previousCards = get().cards
        set((state) => ({
          cards: state.cards.map((c) => 
            c.id === id ? { ...c, ...card } : c
          ),
        }))

        try {
          const response = await api.put(`/credit-cards/${id}`, card)
          const updatedCard = { 
            ...response.data, 
            limit: parseFloat(response.data.limit) 
          }
          
          set((state) => ({
            cards: state.cards.map((c) => 
              c.id === id ? updatedCard : c
            ),
          }))
        } catch (error) {
          set({ cards: previousCards })
          throw error
        }
      },

      removeCard: async (id) => {
        const previousCards = get().cards
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
        }))

        try {
          await api.delete(`/credit-cards/${id}`)
        } catch (error) {
          set({ cards: previousCards })
          throw error
        }
      },

      setIncomeGoal: (incomeGoal) => set({ incomeGoal }),

      getTotalIncome: () => {
        return get().transactions
          .filter((t) => t.type === 'income')
          .reduce((acc, curr) => acc + curr.amount, 0)
      },

      getTotalExpenses: () => {
        return get().transactions
          .filter((t) => t.type === 'expense')
          .reduce((acc, curr) => acc + curr.amount, 0)
      },

      getBalance: () => {
        return get().carriedOverBalance + get().getTotalIncome() - get().getTotalExpenses()
      },
    }),
    {
      name: 'finance-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
