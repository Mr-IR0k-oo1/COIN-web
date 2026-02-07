'use client'

import AdminLayout from '@/components/AdminLayout'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate, cn } from '@/lib/utils'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Department } from '@/lib/types'
import { Search, Filter, Users, UserCheck, Calendar, ArrowUpRight, SearchSlash, Layers } from 'lucide-react'

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
  const submissions = useSubmissionStore((state) => state.submissions)
  const fetchSubmissions = useSubmissionStore((state) => state.fetchSubmissions)
  const hackathons = useHackathonStore((state) => state.hackathons)
  const fetchHackathons = useHackathonStore((state) => state.fetchHackathons)
  const isLoading = useSubmissionStore((state) => state.isLoading)

  const [searchQuery, setSearchQuery] = useState('')
  const [hackathonFilter, setHackathonFilter] = useState<string>('All')
  const [departmentFilter, setDepartmentFilter] = useState<string>('All')

  useEffect(() => {
    fetchSubmissions()
    fetchHackathons()
  }, [fetchSubmissions, fetchHackathons])

  const filtered = submissions.filter((s) => {
    const query = searchQuery.toLowerCase()
    const matchesSearch =
      s.teamName.toLowerCase().includes(query) ||
      (s.hackathonName && s.hackathonName.toLowerCase().includes(query))

    const hackathonMatch = hackathonFilter === 'All' || s.hackathonId === hackathonFilter
    const departmentMatch = departmentFilter === 'All' // Simple department match for now

    return matchesSearch && hackathonMatch && departmentMatch
  })

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-2">
              Intelligence Feed
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Monitor and review student participation across all opportunities
            </p>
          </div>
          <button
            onClick={() => fetchSubmissions()}
            className="px-4 py-2 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold rounded-xl hover:bg-coin-500 hover:text-white transition-all text-sm"
          >
            Refresh Data
          </button>
        </div>

        {/* Filters Panel */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-coin-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search teams or hackathons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Calendar size={12} />
                Opportunity
              </label>
              <select
                value={hackathonFilter}
                onChange={(e) => setHackathonFilter(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none text-sm"
              >
                <option value="All">All Opportunities</option>
                {hackathons.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Filter size={12} />
                Department
              </label>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none text-sm"
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
        </div>

        {/* Submissions Table */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-black/20 border-b border-slate-100 dark:border-slate-800">
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Representation</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Opportunity</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Composition</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Timestamp</th>
                  <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coin-600"></div>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Fetching records...</p>
                      </div>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <SearchSlash className="text-slate-300 dark:text-slate-700" size={48} />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">No submission matching your criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((submission) => (
                    <tr key={submission.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-bold text-slate-900 dark:text-white group-hover:text-coin-600 transition-colors">
                            {submission.teamName}
                          </p>
                          <p className="text-xs text-slate-400 font-mono">{submission.id}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          {submission.hackathonName || 'Intelligence Node'}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                            <Users size={12} />
                            {submission.participantCount}
                          </div>
                          {submission.mentorCount > 0 && (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-500/20">
                              <UserCheck size={12} />
                              {submission.mentorCount}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-slate-500">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link
                          href={`/admin/participation/${submission.id}`}
                          className="inline-flex items-center gap-1 text-sm font-bold text-coin-600 hover:text-coin-700 dark:text-coin-400 dark:hover:text-coin-300 transition-colors"
                        >
                          View Profile <ArrowUpRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Network Points', value: filtered.length, icon: Layers, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/10' },
            { label: 'Active Minds', value: filtered.reduce((sum, s) => sum + s.participantCount, 0), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/10' },
            { label: 'Guide nodes', value: filtered.reduce((sum, s) => sum + s.mentorCount, 0), icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/10' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex items-center gap-6">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", stat.bg, stat.color)}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
