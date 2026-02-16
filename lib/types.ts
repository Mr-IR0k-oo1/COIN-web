import { Department, AcademicYear } from './constants/departments'

export type { Department, AcademicYear }

export type HackathonMode = 'ONLINE' | 'OFFLINE'
export type HackathonStatus = 'UPCOMING' | 'ONGOING' | 'CLOSED'

export type BlogCategory = 'article' | 'winner' | 'announcement'
export type BlogStatus = 'draft' | 'published'

export interface Hackathon {
  id: string
  name: string
  slug?: string
  organizer: string
  description: string
  mode: HackathonMode
  location?: string
  startDate: string
  endDate: string
  registrationDeadline: string
  officialRegistrationLink: string
  eligibility: string
  semester: string
  status: HackathonStatus
  createdAt: string
  updatedAt: string
}

export interface Participant {
  name: string
  email: string
  department: string
  academicYear: string
}

export interface Mentor {
  name: string
  department: string
}

export type SubmissionStatus = 'submitted' | 'verified' | 'archived'

export interface Submission {
  id: string
  hackathonId: string
  teamName: string
  participantCount: number
  mentorCount: number
  externalRegistrationConfirmed: boolean
  status: SubmissionStatus
  createdAt: string
  submittedAt?: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  category: string
  author: string
  relatedHackathon?: string
  status: string
  createdAt: string
  updatedAt: string
}

export interface DashboardMetrics {
  totalHackathons: number
  totalSubmissions: number
  totalStudents: number
  totalMentors: number
}
