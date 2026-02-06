import { Submission } from './types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function generateSubmissionId(): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `SUB-${timestamp}-${random}`.toUpperCase()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function exportToCSV(submissions: Submission[]): string {
  const headers = [
    'submission_id',
    'submitted_at',
    'hackathon_name',
    'team_name',
    'participant_count',
    'mentor_count',
    'participant_name',
    'participant_email',
    'participant_department',
    'participant_year',
    'mentor_names',
    'mentor_departments',
    'external_confirmed',
  ]

  const rows: string[] = []

  submissions.forEach((submission) => {
    submission.participants.forEach((participant) => {
      const mentorNames = submission.mentors.map((m) => m.name).join('; ')
      const mentorDepartments = submission.mentors.map((m) => m.department).join('; ')

      const row = [
        submission.id,
        submission.submittedAt,
        submission.hackathonName,
        submission.teamName,
        submission.participantCount.toString(),
        submission.mentorCount.toString(),
        participant.fullName,
        participant.collegeEmail,
        participant.department,
        participant.academicYear,
        mentorNames,
        mentorDepartments,
        submission.externalConfirmed ? 'Yes' : 'No',
      ]

      rows.push(row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    })
  })

  return [headers.join(','), ...rows].join('\n')
}

export function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToExcel(submissions: Submission[]): Uint8Array {
  // This is a simplified CSV-based approach since we're using xlsx
  // In production, use proper xlsx library with proper formatting
  const headers = [
    'submission_id',
    'submitted_at',
    'hackathon_name',
    'team_name',
    'participant_count',
    'mentor_count',
    'participant_name',
    'participant_email',
    'participant_department',
    'participant_year',
    'mentor_names',
    'mentor_departments',
    'external_confirmed',
  ]

  const rows: (string | number)[][] = []

  submissions.forEach((submission) => {
    submission.participants.forEach((participant) => {
      const mentorNames = submission.mentors.map((m) => m.name).join('; ')
      const mentorDepartments = submission.mentors.map((m) => m.department).join('; ')

      rows.push([
        submission.id,
        submission.submittedAt,
        submission.hackathonName,
        submission.teamName,
        submission.participantCount,
        submission.mentorCount,
        participant.fullName,
        participant.collegeEmail,
        participant.department,
        participant.academicYear,
        mentorNames,
        mentorDepartments,
        submission.externalConfirmed ? 'Yes' : 'No',
      ])
    })
  })

  // Return a simple CSV that can be imported as Excel
  const content = exportToCSV(submissions)
  return new TextEncoder().encode(content)
}

export function downloadExcel(submissions: Submission[], filename: string): void {
  const content = exportToCSV(submissions)
  const blob = new Blob([content], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;',
  })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
