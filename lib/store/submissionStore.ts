import { create } from 'zustand'
import { Submission } from '../types'
import { backendService } from '../services/backend'

interface SubmissionStore {
  submissions: Submission[]
  isLoading: boolean
  error: string | null
  fetchSubmissions: (filters?: any) => Promise<void>
  addSubmission: (submission: any) => Promise<string>
  getSubmissionById: (id: string) => Promise<Submission | undefined>
  getAllSubmissions: () => Submission[]
  updateSubmissionStatus: (id: string, status: string) => Promise<void>
  deleteSubmission: (id: string) => Promise<void>
  getTotalStudents: () => number
  getTotalMentors: () => number
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  submissions: [],
  isLoading: false,
  error: null,

  fetchSubmissions: async (filters) => {
    set({ isLoading: true, error: null })
    try {
      const submissions = await backendService.getSubmissions(filters)
      set({ submissions, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  addSubmission: async (payload) => {
    set({ isLoading: true, error: null })
    try {
      const response = await backendService.submitParticipation(payload)
      set({ isLoading: false })
      return response.submission_id
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  getSubmissionById: async (id: string) => {
    const existing = get().submissions.find(s => s.id === id)
    if (existing && existing.participants.length > 0) return existing

    try {
      const data = await backendService.getSubmissionById(id)
      return data || undefined
    } catch (error) {
      return undefined
    }
  },

  getAllSubmissions: () => {
    return get().submissions
  },

  updateSubmissionStatus: async (id, status) => {
    set({ isLoading: true, error: null })
    try {
      await backendService.updateSubmissionStatus(id, status)
      set((state) => ({
        submissions: state.submissions.map((s) =>
          s.id === id ? { ...s, status } : s
        ),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  deleteSubmission: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await backendService.deleteSubmission(id)
      set((state) => ({
        submissions: state.submissions.filter((s) => s.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
      throw error
    }
  },

  getTotalStudents: () => {
    return get().submissions.reduce((acc, s) => acc + s.participantCount, 0)
  },

  getTotalMentors: () => {
    return get().submissions.reduce((acc, s) => acc + s.mentorCount, 0)
  },
}))
