import { create } from 'zustand'
import { api } from '../api'
import { backendService } from '../services/backend'

export interface StudentUser {
    id: string
    name: string
    email: string
    year: number
    branch: string
    bio?: string
    skills?: string[]
}

interface StudentStore {
    user: StudentUser | null
    isAuthenticated: boolean
    token: string | null
    loading: boolean
    error: string | null

    // Auth actions
    login: (email: string, password: string) => Promise<boolean>
    register: (data: Omit<StudentUser, 'id'> & { password: string }) => Promise<boolean>
    logout: () => void
    initializeAuth: () => void

    // Profile actions
    updateProfile: (data: Partial<StudentUser>) => Promise<boolean>
    fetchProfile: () => Promise<void>

    // Search actions
    searchStudents: (params: { year?: number; branch?: string; skills?: string }) => Promise<StudentUser[]>
}

export const useStudentStore = create<StudentStore>((set, get) => ({
    user: null,
    isAuthenticated: false,
    token: null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null })
        try {
            const response = await backendService.studentLogin(email, password)

            const studentUser: StudentUser = {
                id: response.student.id,
                name: response.student.name,
                email: response.student.email,
                year: response.student.year,
                branch: response.student.branch,
                bio: response.student.bio,
                skills: response.student.skills,
            }

            set({
                user: studentUser,
                isAuthenticated: true,
                token: response.token,
                loading: false
            })

            if (typeof window !== 'undefined') {
                localStorage.setItem('student_token', response.token)
                localStorage.setItem('student_user', JSON.stringify(studentUser))
            }
            return true
        } catch (err: any) {
            set({ error: err.message || 'Login failed', loading: false })
            return false
        }
    },

    register: async (data) => {
        set({ loading: true, error: null })
        try {
            const response = await backendService.studentRegister({
                name: data.name,
                email: data.email,
                password: data.password,
                year: data.year,
                branch: data.branch,
            })

            const studentUser: StudentUser = {
                id: response.student.id,
                name: response.student.name,
                email: response.student.email,
                year: response.student.year,
                branch: response.student.branch,
                bio: response.student.bio,
                skills: response.student.skills,
            }

            set({
                user: studentUser,
                isAuthenticated: true,
                token: response.token,
                loading: false
            })

            if (typeof window !== 'undefined') {
                localStorage.setItem('student_token', response.token)
                localStorage.setItem('student_user', JSON.stringify(studentUser))
            }
            return true
        } catch (err: any) {
            set({ error: err.message || 'Registration failed', loading: false })
            return false
        }
    },

    logout: () => {
        set({ user: null, isAuthenticated: false, token: null })
        if (typeof window !== 'undefined') {
            localStorage.removeItem('student_token')
            localStorage.removeItem('student_user')
        }
    },

    initializeAuth: () => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('student_token')
            const storedUser = localStorage.getItem('student_user')
            if (token && storedUser) {
                try {
                    set({
                        user: JSON.parse(storedUser),
                        isAuthenticated: true,
                        token
                    })
                } catch {
                    localStorage.removeItem('student_token')
                    localStorage.removeItem('student_user')
                }
            }
        }
    },

    updateProfile: async (data) => {
        const { user } = get()
        if (!user) return false

        set({ loading: true })
        try {
            const response = await backendService.updateStudentProfile(user.id, {
                name: data.name,
                year: data.year,
                branch: data.branch,
                bio: data.bio,
                skills: data.skills,
            })

            const updatedUser: StudentUser = {
                ...user,
                ...response
            }

            set({ user: updatedUser, loading: false })

            if (typeof window !== 'undefined') {
                localStorage.setItem('student_user', JSON.stringify(updatedUser))
            }
            return true
        } catch (err) {
            set({ loading: false, error: 'Failed to update profile' })
            return false
        }
    },

    fetchProfile: async () => {
        // Already handled by initializeAuth or would be a separate API call
    },

    searchStudents: async (params) => {
        try {
            const results = await backendService.searchStudents(params)
            return results.map((s: any) => ({
                id: s.id,
                name: s.name,
                email: s.email,
                year: s.year,
                branch: s.branch,
                bio: s.bio,
                skills: s.skills || [],
            }))
        } catch (err) {
            return []
        }
    }
}))
