import { create } from 'zustand'
import api from '@/lib/api'

export type Category = {
  id: number
  name: string
  color: string | null
  icon: string | null
  userId: number | null
}

interface CategoryState {
  categories: Category[]
  isLoading: boolean
  fetchCategories: () => Promise<void>
  addCategory: (category: Omit<Category, 'id' | 'userId'>) => Promise<void>
  removeCategory: (id: number) => Promise<void>
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  isLoading: false,

  fetchCategories: async () => {
    set({ isLoading: true })
    try {
      const response = await api.get('/categories')
      set({ categories: response.data, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      console.error('Error fetching categories:', error)
    }
  },

  addCategory: async (category) => {
    try {
      const response = await api.post('/categories', category)
      set((state) => ({ categories: [...state.categories, response.data] }))
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  },

  removeCategory: async (id) => {
    try {
      await api.delete(`/categories/${id}`)
      set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }))
    } catch (error) {
      console.error('Error removing category:', error)
      throw error
    }
  }
}))
