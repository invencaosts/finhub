import { create } from 'zustand'
import api from '@/lib/api'

interface User {
  id: number
  email: string
  fullName: string | null
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setUser: (user: User | null) => void
  login: (data: any) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (credentials) => {
    set({ isLoading: true })
    try {
      const response = await api.post('/auth/login', credentials)
      const { user } = response.data
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  register: async (data) => {
    set({ isLoading: true })
    try {
      const response = await api.post('/auth/register', data)
      const { user } = response.data
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // Even if API fails, we logout locally
    } finally {
      set({ user: null, isAuthenticated: false })
      window.location.href = '/login'
    }
  },

  checkAuth: async () => {
    try {
      const response = await api.get('/auth/me')
      set({ user: response.data, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  }
}))
