'use client'

import AdminLayout from '@/components/AdminLayout'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { formatDate, cn } from '@/lib/utils'
import { Target, Users, LayoutDashboard, BarChart3, TrendingUp, Calendar, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const hackathons = useHackathonStore((state) => state.getAllHackathons())
  const submissions = useSubmissionStore((state) => state.getAllSubmissions())
  const totalStudents = useSubmissionStore((state) => state.getTotalStudents())
  const totalMentors = useSubmissionStore((state) => state.getTotalMentors())

  const metrics = [
    {
      label: 'Total Hackathons',
      value: hackathons.length,
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/10',
      border: 'border-blue-100 dark:border-blue-900/20'
    },
    {
      label: 'Total Submissions',
      value: submissions.length,
      icon: BarChart3,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/10',
      border: 'border-green-100 dark:border-green-900/20'
    },
    {
      label: 'Students Tracked',
      value: totalStudents,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/10',
      border: 'border-purple-100 dark:border-purple-900/20'
    },
    {
      label: 'Faculty Mentors',
      value: totalMentors,
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50 dark:bg-amber-900/10',
      border: 'border-amber-100 dark:border-amber-900/20'
    },
  ]

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5)

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-2">
            Control Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Real-time intelligence on SREC's innovation ecosystem
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, idx) => (
            <div
              key={idx}
              className={`p-6 bg-white dark:bg-neutral-900 border ${metric.border} rounded-3xl shadow-sm hover:shadow-md transition-shadow transition-colors duration-500 relative overflow-hidden group`}
            >
              <div className={`absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-125 group-hover:opacity-10 transition-all duration-700`}>
                <metric.icon size={80} />
              </div>
              <div className="relative z-10 flex flex-col gap-4">
                <div className={`w-12 h-12 rounded-2xl ${metric.bg} ${metric.color} flex items-center justify-center`}>
                  <metric.icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">{metric.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Breakdown */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-3">
              <Calendar className="text-coin-600" size={20} />
              Activity Status
            </h3>
            <div className="space-y-6">
              {['Active', 'Upcoming', 'Closed', 'Completed'].map((status) => {
                const count = hackathons.filter((h) => h.status === status).length
                const percentage = hackathons.length > 0 ? (count / hackathons.length) * 100 : 0
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-700 dark:text-slate-300">{status}</span>
                      <span className="text-slate-400 font-medium">{count} items</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          status === 'Active' ? "bg-green-500" :
                            status === 'Upcoming' ? "bg-blue-500" :
                              status === 'Closed' ? "bg-slate-400" : "bg-coin-600"
                        )}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Engagement Overview */}
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <Users className="text-coin-600" size={20} />
                Department Insights
              </h3>
              <Link href="/admin/participation" className="text-sm font-bold text-coin-600 hover:underline flex items-center gap-1">
                Full Report <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-5">
              {(() => {
                const deptCount: Record<string, number> = {}
                submissions.forEach((s) => {
                  s.participants.forEach((p) => {
                    deptCount[p.department] = (deptCount[p.department] || 0) + 1
                  })
                })
                const sortedDepts = Object.entries(deptCount)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)

                if (sortedDepts.length === 0) {
                  return <p className="text-slate-500 italic py-8 text-center bg-slate-50 dark:bg-white/5 rounded-2xl">No departmental data available yet</p>
                }

                return sortedDepts.map(([dept, count], idx) => {
                  const maxCount = sortedDepts[0][1]
                  const percentage = (count / maxCount) * 100
                  return (
                    <div key={dept} className="flex items-center gap-4 group">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-xs font-bold text-slate-500">
                        0{idx + 1}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <div className="flex justify-between text-sm font-medium">
                          <span className="text-slate-800 dark:text-slate-200">{dept}</span>
                          <span className="text-slate-500">{count} students</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-slate-900 dark:bg-white group-hover:bg-coin-600 transition-all duration-700"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </div>

        {/* Recent Submissions Table */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Intelligence</h3>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Updates</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Hackathon</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Team Representation</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Composition</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {recentSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-500 italic">
                      Monitoring innovation signal... No data points received yet.
                    </td>
                  </tr>
                ) : (
                  recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                      <td className="px-8 py-5">
                        <p className="font-bold text-slate-800 dark:text-slate-200 text-sm group-hover:text-coin-600 transition-colors">
                          {sub.hackathonName}
                        </p>
                      </td>
                      <td className="px-8 py-5">
                        <span className="inline-flex items-center px-3 py-1 bg-coin-50 dark:bg-coin-900/20 text-coin-600 dark:text-coin-400 text-xs font-bold rounded-lg border border-coin-100 dark:border-coin-900/30">
                          {sub.teamName}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                          <Users size={14} className="opacity-60" />
                          {sub.participantCount} Participants
                        </p>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
                          {formatDate(sub.submittedAt)}
                        </p>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
