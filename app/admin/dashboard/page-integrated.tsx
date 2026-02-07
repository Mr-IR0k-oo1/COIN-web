'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/authStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { useBlogStore } from '@/lib/store/blogStore'
import { backendService } from '@/lib/services/backend'
import AdminLayout from '@/components/AdminLayout'
import { DashboardMetrics } from '@/lib/types'
import { Loader2, BarChart3, BookOpen, Zap, Users } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const { isAuthenticated, admin } = useAuthStore()
  const { fetchHackathons, hackathons } = useHackathonStore()
  const { fetchBlogPosts, posts } = useBlogStore()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin/login')
      return
    }

    const loadData = async () => {
      try {
        setIsLoading(true)
        await Promise.all([
          fetchHackathons(),
          fetchBlogPosts(),
          (async () => {
            const data = await backendService.getMetrics()
            setMetrics(data)
          })(),
        ])
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated, router, fetchHackathons, fetchBlogPosts])

  if (!isAuthenticated || isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-coin-600" />
        </div>
      </AdminLayout>
    )
  }

  const statCards = [
    {
      title: 'Total Hackathons',
      value: metrics?.totalHackathons || 0,
      icon: Zap,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Total Submissions',
      value: metrics?.totalSubmissions || 0,
      icon: BarChart3,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Total Students',
      value: metrics?.totalStudents || 0,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Total Mentors',
      value: metrics?.totalMentors || 0,
      icon: BookOpen,
      color: 'bg-orange-100 text-orange-600',
    },
  ]

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome, {admin?.name}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Here's your innovation ecosystem at a glance
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.title}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {card.title}
                  </h3>
                  <div className={`p-2 rounded-lg ${card.color}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  {card.value}
                </p>
              </div>
            )
          })}
        </div>

        {/* Recent Hackathons */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Recent Hackathons
            </h2>
            <div className="space-y-3">
              {hackathons.slice(0, 5).map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{h.name}</p>
                    <p className="text-sm text-slate-500">{h.organizer}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      h.status === 'Active'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : h.status === 'Upcoming'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {h.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Blog Posts */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Recent Blog Posts
            </h2>
            <div className="space-y-3">
              {posts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white line-clamp-1">
                      {p.title}
                    </p>
                    <p className="text-sm text-slate-500">{p.category}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.status === 'Published'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
