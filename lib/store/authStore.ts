import { create } from 'zustand'
import { backendService } from '../services/backend'

interface AdminUser {
  id: string
  name: string
  email: string
}

interface AuthStore {
  isAuthenticated: boolean
  adminName: string
  adminEmail: string
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  initializeAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  adminName: '',
  adminEmail: '',
  token: null,

  login: async (email: string, password: string) => {
    try {
      const response = await backendService.login(email, password)

      if (response.token) {
        set({
          isAuthenticated: true,
          adminName: response.admin.name,
          adminEmail: response.admin.email,
          token: response.token,
        })
        if (typeof window !== 'undefined') {
          localStorage.setItem('coin_token', response.token)
          localStorage.setItem('coin_auth', JSON.stringify({
            isAuthenticated: true,
            adminName: response.admin.name,
            adminEmail: response.admin.email,
          }))
        }
        return true
      }
      return false
    } catch (error) {
      console.error('Login failed:', error)
      return false
    }
  },

  logout: () => {
    set({ isAuthenticated: false, adminName: '', adminEmail: '', token: null })
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coin_token')
      localStorage.removeItem('coin_auth')
    }
  },

  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('coin_token')
      const stored = localStorage.getItem('coin_auth')
      if (token && stored) {
        try {
          const { isAuthenticated, adminName, adminEmail } = JSON.parse(stored)
          set({ isAuthenticated, adminName, adminEmail, token })
        } catch {
          localStorage.removeItem('coin_token')
          localStorage.removeItem('coin_auth')
        }
      }
    }
  },
}))
