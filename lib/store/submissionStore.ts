import { create } from 'zustand'
import { Submission } from '../types'

interface SubmissionStore {
  submissions: Submission[]
  addSubmission: (submission: Submission) => void
  getSubmissionById: (id: string) => Submission | undefined
  getAllSubmissions: () => Submission[]
  getSubmissionsByHackathon: (hackathonId: string) => Submission[]
  updateSubmission: (id: string, submission: Partial<Submission>) => void
  deleteSubmission: (id: string) => void
  getTotalStudents: () => number
  getTotalMentors: () => number
}

export const useSubmissionStore = create<SubmissionStore>((set, get) => ({
  submissions: [],

  addSubmission: (submission: Submission) => {
    set((state) => ({
      submissions: [...state.submissions, submission],
    }))
  },

  getSubmissionById: (id: string) => {
    return get().submissions.find((s) => s.id === id)
  },

  getAllSubmissions: () => {
    return get().submissions
  },

  getSubmissionsByHackathon: (hackathonId: string) => {
    return get().submissions.filter((s) => s.hackathonId === hackathonId)
  },

  updateSubmission: (id: string, updates: Partial<Submission>) => {
    set((state) => ({
      submissions: state.submissions.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    }))
  },

  deleteSubmission: (id: string) => {
    set((state) => ({
      submissions: state.submissions.filter((s) => s.id !== id),
    }))
  },

  getTotalStudents: () => {
    const emails = new Set<string>()
    get().submissions.forEach((s) => {
      s.participants.forEach((p) => {
        emails.add(p.collegeEmail)
      })
    })
    return emails.size
  },

  getTotalMentors: () => {
    const mentors = new Set<string>()
    get().submissions.forEach((s) => {
      s.mentors.forEach((m) => {
        mentors.add(m.name)
      })
    })
    return mentors.size
  },
}))
