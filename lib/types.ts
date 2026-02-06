export type AcademicYear = 'First Year' | 'Second Year' | 'Third Year' | 'Fourth Year'

export type Department = 
  | 'Computer Science'
  | 'Electronics'
  | 'Mechanical'
  | 'Electrical'
  | 'Civil'
  | 'Chemical'
  | 'Information Technology'

export type HackathonMode = 'In-Person' | 'Online' | 'Hybrid'
export type HackathonStatus = 'Active' | 'Closed' | 'Upcoming' | 'Completed'

export type BlogCategory = 'Article' | 'Winner' | 'Announcement'
export type BlogStatus = 'Draft' | 'Published'

export interface Hackathon {
  id: string
  slug: string
  name: string
  organizer: string
  description: string
  mode: HackathonMode
  location?: string
  startDate: string
  endDate: string
  registrationDeadline: string
  officialLink: string
  eligibility: string
  semester: string
  status: HackathonStatus
  createdAt: string
  updatedAt: string
}

export interface Participant {
  fullName: string
  collegeEmail: string
  department: Department
  academicYear: AcademicYear
}

export interface Mentor {
  name: string
  department: Department
}

export interface Submission {
  id: string
  hackathonId: string
  hackathonName: string
  teamName: string
  participantCount: number
  mentorCount: number
  participants: Participant[]
  mentors: Mentor[]
  externalConfirmed: boolean
  submittedAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  summary: string
  content: string
  category: BlogCategory
  tags: string[]
  relatedHackathon?: string
  status: BlogStatus
  createdAt: string
  updatedAt: string
  authorId?: string
}

export interface DashboardMetrics {
  totalHackathons: number
  totalSubmissions: number
  totalStudents: number
  totalMentors: number
}
