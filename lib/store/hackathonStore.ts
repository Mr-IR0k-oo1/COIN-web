import { create } from 'zustand'
import { Hackathon } from '../types'
import { backendService } from '../services/backend'

interface HackathonStore {
  hackathons: Hackathon[]
  isLoading: boolean
  error: string | null
  fetchHackathons: () => Promise<void>
  getHackathonById: (id: string) => Promise<Hackathon | undefined>
  getHackathonBySlug: (slug: string) => Promise<Hackathon | undefined>
  addHackathon: (hackathon: Omit<Hackathon, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => Promise<Hackathon>
  updateHackathon: (id: string, updates: Partial<Hackathon>) => Promise<Hackathon>
  deleteHackathon: (id: string) => Promise<void>
}

export const useHackathonStore = create<HackathonStore>((set, get) => ({
  hackathons: [],
  isLoading: false,
  error: null,

  fetchHackathons: async () => {
    set({ isLoading: true, error: null })
    try {
      const hackathons = await backendService.getHackathons()
      set({ hackathons, isLoading: false })
    } catch (ere: any) {
      set({ error: ere.message, isLoading: false })
    }
  },

  getHackathonById: async (id: string) => {
    const existing = get().hackathons.find((h) => h.id === id)
    if (existing) return existing
    try {
      const hackathon = await backendService.getHackathonById(id)
      return hackathon || undefined
    } catch {
      return undefined
    }
  },

  getHackathonBySlug: async (slug: string) => {
    const existing = get().hackathons.find((h) => h.slug === slug)
    if (existing) return existing
    try {
      // Backend get_hackathon handler looks up by ID or slug in public routes
      const hackathon = await backendService.getHackathonById(slug)
      return hackathon || undefined
    } catch {
      return undefined
    }
  },

  addHackathon: async (hackathon) => {
    set({ isLoading: true, error: null })
    try {
      const newHackathon = await backendService.createHackathon(hackathon)
      set((state) => ({
        hackathons: [...state.hackathons, newHackathon],
        isLoading: false,
      }))
      return newHackathon
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  updateHackathon: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      const updated = await backendService.updateHackathon(id, updates)
      set((state) => ({
        hackathons: state.hackathons.map((h) => (h.id === id ? updated : h)),
        isLoading: false,
      }))
      return updated
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteHackathon: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await backendService.deleteHackathon(id)
      set((state) => ({
        hackathons: state.hackathons.filter((h) => h.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },
}))
