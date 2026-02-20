'use client'

import AdminLayout from '@/components/AdminLayout'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { useRouter } from 'next/navigation'
import { formatDate, cn } from '@/lib/utils'
import { ArrowLeft, Users, UserCheck, ShieldCheck, Mail, Map, GraduationCap, Clock, Hash, ExternalLink, Bookmark } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Submission } from '@/lib/types'

interface PageProps {
  params: {
    id: string
  }
}

export default function ParticipationDetailPage({ params }: PageProps) {
  const router = useRouter()
  const getSubmissionById = useSubmissionStore((state) => state.getSubmissionById)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const result = await getSubmissionById(params.id)
      if (result) {
        setSubmission(result)
      }
      setLoading(false)
    }
    fetchData()
  }, [params.id, getSubmissionById])

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flame-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="w-20 h-20 bg-ash-100 dark:bg-ash-900 rounded-3xl flex items-center justify-center text-ash-400">
            <Hash size={40} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-ash-900 dark:text-white font-heading">Record Not Found</h2>
            <p className="text-ash-500 mt-2">The requested intelligence packet has been moved or purged.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-ash-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 transition-all"
          >
            Revert to Feed
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm font-bold text-ash-400 hover:text-flame-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Return to Intelligence Feed
            </button>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-bold text-ash-900 dark:text-white font-heading tracking-tight">{submission.teamName}</h1>
              <div className="px-3 py-1 bg-flame-500/10 text-flame-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-flame-500/20">
                Record Validated
              </div>
            </div>
            <p className="text-ash-500 dark:text-ash-400 font-medium flex items-center gap-2">
              <Bookmark size={16} className="text-flame-600" />
              Intelligence Node #{submission.hackathonId.substring(0, 8)}
            </p>
          </div>
          <div className="bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-ash-50 dark:bg-ash-900 flex items-center justify-center text-ash-400">
              <Hash size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest">Entry ID</p>
              <p className="font-mono text-sm font-bold text-flame-600">{submission.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 rounded-[40px] p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-ember-500/10 flex items-center justify-center text-ember-600">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white font-heading">Core Personnel</h2>
                  <p className="text-xs text-ash-400 font-bold uppercase tracking-widest mt-1">Verification level: High</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submission.participants?.map((p, idx) => (
                  <div key={idx} className="bg-ash-50 dark:bg-ash-900/40 rounded-3xl p-6 border border-ash-100 dark:border-ash-800 hover:border-ember-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-ash-800 flex items-center justify-center text-ash-300">
                        <Users size={24} />
                      </div>
                      <span className="px-2.5 py-1 bg-white dark:bg-ash-800 rounded-lg text-[10px] font-bold text-ember-600 uppercase border border-ash-100 dark:border-ash-700">
                        {p.department}
                      </span>
                    </div>
                    <p className="font-bold text-ash-900 dark:text-white text-lg">{p.fullName}</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-ash-500 flex items-center gap-2">
                        <Mail size={12} className="text-ash-400" />
                        {p.collegeEmail}
                      </p>
                      <p className="text-xs text-ash-500 flex items-center gap-2">
                        <GraduationCap size={12} className="text-ash-400" />
                        {p.academicYear}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {submission.mentors && submission.mentors.length > 0 && (
              <div className="bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 rounded-[40px] p-8 md:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-flame-500/10 flex items-center justify-center text-flame-600">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-white font-heading">Institutional Guides</h2>
                    <p className="text-xs text-ash-400 font-bold uppercase tracking-widest mt-1">Subject matter experts</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {submission.mentors?.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-ash-50 dark:bg-ash-900/40 rounded-2xl border border-ash-100 dark:border-ash-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-ash-800 flex items-center justify-center text-flame-600">
                          <UserCheck size={20} />
                        </div>
                        <p className="font-bold text-ash-900 dark:text-white">{m.name}</p>
                      </div>
                      <span className="text-xs font-bold text-ash-400 uppercase tracking-widest bg-white dark:bg-ash-800 px-3 py-1 rounded-lg">
                        {m.department}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 rounded-[40px] p-8 shadow-sm">
              <h2 className="text-lg font-bold dark:text-white font-heading mb-8">System Telemetry</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-ash-50 dark:bg-ash-900 rounded-xl flex items-center justify-center text-ash-400">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest">Logged On</p>
                    <p className="text-sm font-bold text-ash-700 dark:text-ash-300">{formatDate(submission.submittedAt || '')}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-ash-50 dark:bg-ash-900 rounded-xl flex items-center justify-center text-ash-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest">External Status</p>
                    <p className={cn(
                      "text-sm font-bold",
                      submission.externalConfirmed ? "text-flame-600" : "text-ember-500"
                    )}>
                      {submission.externalConfirmed ? 'Sanctioned & Confirmed' : 'Pending Verification'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-ash-50 dark:bg-ash-900 rounded-xl flex items-center justify-center text-ash-400">
                    <Map size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest">Deployment Nodes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.from(new Set(submission.participants?.map(p => p.department) || [])).map(dept => (
                        <span key={dept} className="text-[10px] bg-ash-100 dark:bg-ash-900 px-2 py-0.5 rounded-md text-ash-500">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-ash-100 dark:border-ash-800">
                  <button className="w-full py-4 bg-ash-100 dark:bg-ash-900 text-ash-600 dark:text-ash-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-flame-500 hover:text-white transition-all">
                    <ExternalLink size={18} />
                    Audit Entry Logs
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-flame-600 rounded-[40px] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={80} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-flame-200 mb-2">Record Integrity</p>
              <h3 className="text-xl font-bold font-heading mb-4">Official Submission</h3>
              <p className="text-sm text-flame-100 leading-relaxed mb-6">
                This record has been digitally signed and cross-referenced with institutional data. Any modifications must be recorded in the audit trail.
              </p>
              <button className="w-full py-3 bg-white text-flame-600 font-bold rounded-xl text-sm">
                Generate Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
