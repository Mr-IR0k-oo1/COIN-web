'use client'

import AdminLayout from '@/components/AdminLayout'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useState } from 'react'
import { Department } from '@/lib/types'

const DEPARTMENTS: Department[] = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Electrical',
  'Civil',
  'Chemical',
]

export default function ParticipationPage() {
  const submissions = useSubmissionStore((state) => state.getAllSubmissions())
  const hackathons = useHackathonStore((state) => state.getAllHackathons())

  const [hackathonFilter, setHackathonFilter] = useState<string>('All')
  const [departmentFilter, setDepartmentFilter] = useState<string>('All')

  const filtered = submissions.filter((s) => {
    const hackathonMatch = hackathonFilter === 'All' || s.hackathonId === hackathonFilter
    const departmentMatch =
      departmentFilter === 'All' ||
      s.participants.some((p) => p.department === departmentFilter)
    return hackathonMatch && departmentMatch
  })

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="section-heading mb-2">Participation Tracking</h1>
          <p className="text-gray-600">Review and manage student submissions</p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Filter by Hackathon</label>
            <select
              value={hackathonFilter}
              onChange={(e) => setHackathonFilter(e.target.value)}
              className="select-field"
            >
              <option value="All">All Hackathons</option>
              {hackathons.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Filter by Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="select-field"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              {submissions.length === 0 ? 'No submissions yet' : 'No submissions match filters'}
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Hackathon</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Team</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Participants</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Mentors</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Submitted</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((submission) => (
                  <tr key={submission.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-gray-900 font-medium text-sm">
                      {submission.hackathonName}
                    </td>
                    <td className="py-3 px-6 text-gray-600 text-sm">{submission.teamName}</td>
                    <td className="py-3 px-6 text-gray-600 text-sm">{submission.participantCount}</td>
                    <td className="py-3 px-6 text-gray-600 text-sm">{submission.mentorCount}</td>
                    <td className="py-3 px-6 text-gray-600 text-sm">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="py-3 px-6">
                      <Link
                        href={`/admin/participation/${submission.id}`}
                        className="text-coin-600 hover:text-coin-700 font-medium text-sm"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Total Submissions</p>
            <p className="text-3xl font-bold text-gray-900">{filtered.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Total Participants</p>
            <p className="text-3xl font-bold text-gray-900">
              {filtered.reduce((sum, s) => sum + s.participantCount, 0)}
            </p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Total Mentors</p>
            <p className="text-3xl font-bold text-gray-900">
              {filtered.reduce((sum, s) => sum + s.mentorCount, 0)}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
