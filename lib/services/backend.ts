/**
 * Backend API Service Layer
 * Handles all communication with the Rust/Axum backend
 */

import { api } from '../api'
import { Hackathon, Submission, BlogPost, DashboardMetrics, Participant, Mentor, BlogStatus } from '../types'

// Types for backend responses
interface BackendHackathon {
  id: string
  name: string
  organizer: string
  description: string
  mode: string // ONLINE, OFFLINE
  location?: string
  start_date: string
  end_date: string
  registration_deadline: string
  official_registration_link: string
  eligibility: string
  status: string // UPCOMING, ONGOING, CLOSED
  semester: string
  created_at: string
  updated_at: string
  created_by: string
}

interface BackendBlogPost {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  category: string
  author: string
  related_hackathon?: string
  status: string
  created_at: string
  updated_at: string
}

interface BackendSubmission {
  id: string
  hackathon_id: string
  team_name: string
  participant_count: number
  mentor_count: number
  external_registration_confirmed: boolean
  status: string
  created_at: string
}

interface BackendParticipant {
  id: string
  submission_id: string
  name: string
  email: string
  department: string
  academic_year: string
}

interface BackendMentor {
  id: string
  submission_id: string
  name: string
  department: string
}

interface BackendSubmissionDetail {
  submission: BackendSubmission
  participants: BackendParticipant[]
  mentors: BackendMentor[]
}

interface LoginResponse {
  token: string
  admin: {
    id: string
    name: string
    email: string
  }
}

interface StudentLoginResponse {
  token: string
  student: {
    id: string
    name: string
    email: string
    year: number
    branch: string
    bio?: string
    skills: string[]
  }
}

interface MetricsResponse {
  total_hackathons: number
  total_submissions: number
  total_students: number
  total_mentors: number
}

// Map backend response to frontend types
function mapBackendHackathon(data: BackendHackathon): Hackathon {
  return {
    id: data.id,
    slug: data.name.toLowerCase().replace(/\s+/g, '-'),
    name: data.name,
    organizer: data.organizer,
    description: data.description,
    mode: mapMode(data.mode),
    location: data.location,
    startDate: data.start_date,
    endDate: data.end_date,
    registrationDeadline: data.registration_deadline,
    officialRegistrationLink: data.official_registration_link,
    eligibility: data.eligibility,
    semester: data.semester,
    status: mapStatus(data.status),
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapMode(mode: string): 'ONLINE' | 'OFFLINE' {
  switch (mode) {
    case 'ONLINE':
      return 'ONLINE'
    case 'OFFLINE':
      return 'OFFLINE'
    default:
      return 'ONLINE'
  }
}

function mapStatus(status: string): 'UPCOMING' | 'ONGOING' | 'CLOSED' {
  switch (status) {
    case 'UPCOMING':
      return 'UPCOMING'
    case 'ONGOING':
      return 'ONGOING'
    case 'CLOSED':
      return 'CLOSED'
    default:
      return 'UPCOMING'
  }
}

function mapBackendBlogPost(data: BackendBlogPost): BlogPost {
  return {
    id: data.id,
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    content: data.content,
    category: mapBlogCategory(data.category),
    relatedHackathon: data.related_hackathon,
    status: data.status as BlogStatus,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

function mapBlogCategory(category: string): 'article' | 'winner' | 'announcement' {
  switch (category) {
    case 'article':
      return 'article'
    case 'winner':
      return 'winner'
    case 'announcement':
      return 'announcement'
    default:
      return 'article'
  }
}

export const backendService = {
  // Hackathons
  async getHackathons(page = 1, limit = 100): Promise<Hackathon[]> {
    const response = await api.get<any>('/hackathons', {
      params: { page, limit },
    })
    // Public routes return { data: [...] }, Admin routes return [...]
    const items = response.data || response
    return items.map((h: BackendHackathon) => mapBackendHackathon(h))
  },

  async getHackathonById(id: string): Promise<Hackathon | null> {
    try {
      const data = await api.get<BackendHackathon>(`/hackathons/${id}`)
      return mapBackendHackathon(data)
    } catch {
      return null
    }
  },

  async getHackathonBySlug(slug: string): Promise<Hackathon | null> {
    try {
      const data = await api.get<BackendHackathon>(`/hackathons/slug/${slug}`)
      return mapBackendHackathon(data)
    } catch {
      return null
    }
  },

  async createHackathon(hackathon: any): Promise<Hackathon> {
    const data = await api.post<BackendHackathon>('/admin/hackathons', {
      name: hackathon.name,
      organizer: hackathon.organizer,
      description: hackathon.description,
      mode: hackathon.mode,
      location: hackathon.location,
      start_date: hackathon.startDate,
      end_date: hackathon.endDate,
      registration_deadline: hackathon.registrationDeadline,
      official_registration_link: hackathon.officialRegistrationLink,
      eligibility: hackathon.eligibility,
      semester: hackathon.semester,
      status: hackathon.status || 'UPCOMING',
    })
    return mapBackendHackathon(data)
  },

  async updateHackathon(id: string, updates: any): Promise<Hackathon> {
    const data = await api.put<BackendHackathon>(`/admin/hackathons/${id}`, {
      name: updates.name,
      organizer: updates.organizer,
      description: updates.description,
      mode: updates.mode,
      location: updates.location,
      start_date: updates.startDate,
      end_date: updates.endDate,
      registration_deadline: updates.registrationDeadline,
      official_registration_link: updates.officialRegistrationLink,
      eligibility: updates.eligibility,
      semester: updates.semester,
    })
    return mapBackendHackathon(data)
  },

  async updateHackathonStatus(id: string, status: string): Promise<Hackathon> {
    const data = await api.patch<BackendHackathon>(`/admin/hackathons/${id}/status`, {
      status,
    })
    return mapBackendHackathon(data)
  },

  async deleteHackathon(id: string): Promise<void> {
    await api.delete(`/admin/hackathons/${id}`)
  },

  // Blog
  async getBlogPosts(page = 1, limit = 100): Promise<BlogPost[]> {
    const response = await api.get<any>('/blog', {
      params: { page, limit },
    })
    const items = response.data || response
    return items.map((p: BackendBlogPost) => mapBackendBlogPost(p))
  },

  async getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
    try {
      const data = await api.get<BackendBlogPost>(`/blog/${slug}`)
      return mapBackendBlogPost(data)
    } catch {
      return null
    }
  },

  async createBlogPost(post: any): Promise<BlogPost> {
    const data = await api.post<BackendBlogPost>('/admin/blog', {
      title: post.title,
      summary: post.summary,
      content: post.content,
      category: post.category.toLowerCase(),
      author: post.author,
      related_hackathon: post.relatedHackathon,
      status: post.status?.toLowerCase() || 'draft',
    })
    return mapBackendBlogPost(data)
  },

  async updateBlogPost(id: string, updates: any): Promise<BlogPost> {
    const data = await api.put<BackendBlogPost>(`/admin/blog/${id}`, {
      title: updates.title,
      summary: updates.summary,
      content: updates.content,
      category: updates.category?.toLowerCase(),
      author: updates.author,
      status: updates.status?.toLowerCase(),
      related_hackathon: updates.relatedHackathon,
    })
    return mapBackendBlogPost(data)
  },

  async deleteBlogPost(id: string): Promise<void> {
    await api.delete(`/admin/blog/${id}`)
  },

  // Submissions
  async getSubmissions(filters?: any): Promise<Submission[]> {
    const response = await api.get<any>('/admin/submissions', {
      params: filters,
    })
    // Submissions usually come from admin route, so likely a raw array
    const items = Array.isArray(response) ? response : (response.data || [])
    // We need to map BackendSubmission to Submission
    return items.map((s: BackendSubmission) => ({
      id: s.id,
      hackathonId: s.hackathon_id,
      teamName: s.team_name,
      participantCount: s.participant_count,
      mentorCount: s.mentor_count,
      externalRegistrationConfirmed: s.external_registration_confirmed,
      status: s.status as any,
      createdAt: s.created_at,
      submittedAt: s.created_at,
    }))
  },

  async getSubmissionById(id: string): Promise<Submission | null> {
    try {
      const data = await api.get<BackendSubmissionDetail>(`/admin/submissions/${id}`)
      return {
        id: data.submission.id,
        hackathonId: data.submission.hackathon_id,
        hackathonName: '',
        teamName: data.submission.team_name,
        participantCount: data.submission.participant_count,
        mentorCount: data.submission.mentor_count,
        participants: data.participants.map((p): Participant => ({
          fullName: p.name,
          collegeEmail: p.email,
          department: p.department as any,
          academicYear: p.academic_year as any
        })),
        mentors: data.mentors.map((m): Mentor => ({
          name: m.name,
          department: m.department as any
        })),
        externalConfirmed: data.submission.external_registration_confirmed,
        submittedAt: data.submission.created_at,
      }
    } catch {
      return null
    }
  },

  async submitParticipation(submission: any): Promise<{ submission_id: string; status: string }> {
    return api.post('/submit', {
      hackathon_id: submission.hackathonId,
      team_name: submission.teamName,
      external_registration_confirmed: submission.externalConfirmed,
      participants: submission.participants.map((p: any) => ({
        name: p.fullName,
        email: p.collegeEmail,
        department: p.department,
        academic_year: p.academicYear,
      })),
      mentors: submission.mentors.map((m: any) => ({
        name: m.name,
        department: m.department,
      })),
    })
  },

  async updateSubmissionStatus(id: string, status: string): Promise<void> {
    await api.patch(`/admin/submissions/${id}/status`, {
      status,
    })
  },

  async deleteSubmission(id: string): Promise<void> {
    await api.delete(`/admin/submissions/${id}`)
  },

  // Auth
  async login(email: string, password: string): Promise<LoginResponse> {
    return api.post<LoginResponse>('/admin/login', {
      email,
      password,
    })
  },

  // Student endpoints
  async studentRegister(data: {
    name: string
    email: string
    password: string
    year: number
    branch: string
  }): Promise<StudentLoginResponse> {
    return api.post<StudentLoginResponse>('/student/register', data)
  },

  async studentLogin(email: string, password: string): Promise<StudentLoginResponse> {
    return api.post<StudentLoginResponse>('/student/login', {
      email,
      password,
    })
  },

  async searchStudents(filters?: {
    year?: number
    branch?: string
    skills?: string
  }): Promise<any[]> {
    const response = await api.get<any>('/student/search', {
      params: filters,
    })
    return response.students || []
  },

  async updateStudentProfile(
    studentId: string,
    updates: {
      name?: string
      year?: number
      branch?: string
      bio?: string
      skills?: string[]
    }
  ): Promise<any> {
    return api.put(`/student/${studentId}`, updates)
  },

  // Metrics
  async getMetrics(): Promise<DashboardMetrics> {
    const data = await api.get<MetricsResponse>('/admin/metrics')
    return {
      totalHackathons: data.total_hackathons,
      totalSubmissions: data.total_submissions,
      totalStudents: data.total_students,
      totalMentors: data.total_mentors,
    }
  },

  // Export
  async exportData(filters?: any): Promise<Blob> {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/admin/export?${new URLSearchParams(filters).toString()}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('coin_token') : ''}`,
        },
      }
    )
    if (!response.ok) throw new Error('Export failed')
    return response.blob()
  },
}
