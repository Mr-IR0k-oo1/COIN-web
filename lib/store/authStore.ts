import { create } from 'zustand'

interface AuthStore {
  isAuthenticated: boolean
  adminName: string
  login: (password: string, name: string) => boolean
  logout: () => void
  initializeAuth: () => void
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'CoIN2024SREC'

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  adminName: '',

  login: (password: string, name: string) => {
    if (password === ADMIN_PASSWORD) {
      set({ isAuthenticated: true, adminName: name })
      if (typeof window !== 'undefined') {
        localStorage.setItem('coin_auth', JSON.stringify({ isAuthenticated: true, adminName: name }))
      }
      return true
    }
    return false
  },

  logout: () => {
    set({ isAuthenticated: false, adminName: '' })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coin_auth')
    }
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('coin_auth')
      if (stored) {
        try {
          const { isAuthenticated, adminName } = JSON.parse(stored)
          set({ isAuthenticated, adminName })
        } catch {
          localStorage.removeItem('coin_auth')
        }
      }
    }
  },
}))
