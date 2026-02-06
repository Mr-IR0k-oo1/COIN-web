'use client'

import AdminLayout from '@/components/AdminLayout'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const hackathons = useHackathonStore((state) => state.getAllHackathons())
  const submissions = useSubmissionStore((state) => state.getAllSubmissions())
  const totalStudents = useSubmissionStore((state) => state.getTotalStudents())
  const totalMentors = useSubmissionStore((state) => state.getTotalMentors())

  const metrics = [
    { label: 'Total Hackathons', value: hackathons.length, color: 'bg-blue-100 text-blue-700' },
    { label: 'Total Submissions', value: submissions.length, color: 'bg-green-100 text-green-700' },
    { label: 'Total Students', value: totalStudents, color: 'bg-purple-100 text-purple-700' },
    { label: 'Total Mentors', value: totalMentors, color: 'bg-orange-100 text-orange-700' },
  ]

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="section-heading mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of CoIN metrics and recent activity</p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <div key={idx} className="card p-6">
              <p className="text-gray-600 text-sm font-medium mb-2">{metric.label}</p>
              <p className={`text-4xl font-bold ${metric.color} inline-block px-4 py-2 rounded-lg`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card p-6">
            <h3 className="heading-md mb-4">Hackathons by Status</h3>
            <div className="space-y-3">
              {['Active', 'Upcoming', 'Closed', 'Completed'].map((status) => {
                const count = hackathons.filter((h) => h.status === status).length
                return (
                  <div key={status} className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700">{status}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="heading-md mb-4">Participation by Hackathon</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {hackathons.map((h) => {
                const count = submissions.filter((s) => s.hackathonId === h.id).length
                return (
                  <div key={h.id} className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-0">
                    <span className="text-sm text-gray-700 truncate">{h.name}</span>
                    <span className="font-bold text-gray-900">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="heading-md mb-4">Top Departments</h3>
            <div className="space-y-3">
              {(() => {
                const deptCount: Record<string, number> = {}
                submissions.forEach((s) => {
                  s.participants.forEach((p) => {
                    deptCount[p.department] = (deptCount[p.department] || 0) + 1
                  })
                })
                return Object.entries(deptCount)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([dept, count]) => (
                    <div key={dept} className="flex justify-between items-center pb-2 border-b border-gray-200 last:border-0">
                      <span className="text-sm text-gray-700">{dept}</span>
                      <span className="font-bold text-gray-900">{count}</span>
                    </div>
                  ))
              })()}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="card p-6">
          <h3 className="heading-md mb-4">Recent Submissions</h3>
          {recentSubmissions.length === 0 ? (
            <p className="text-gray-600">No submissions yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Hackathon</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Team</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Participants</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-700">{sub.hackathonName}</td>
                      <td className="py-3 px-4 text-gray-700">{sub.teamName}</td>
                      <td className="py-3 px-4 text-gray-700">{sub.participantCount}</td>
                      <td className="py-3 px-4 text-gray-600 text-xs">
                        {formatDate(sub.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
