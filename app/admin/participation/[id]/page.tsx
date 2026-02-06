'use client'

import AdminLayout from '@/components/AdminLayout'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { useRouter } from 'next/navigation'
import { formatDate, cn } from '@/lib/utils'
import { ArrowLeft, Users, UserCheck, Calendar, ShieldCheck, Mail, Map, GraduationCap, Clock, Hash, ExternalLink, Bookmark } from 'lucide-react'

interface PageProps {
  params: {
    id: string
  }
}

export default function ParticipationDetailPage({ params }: PageProps) {
  const router = useRouter()
  const submission = useSubmissionStore((state) => state.getSubmissionById(params.id))

  if (!submission) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center text-slate-400">
            <Hash size={40} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Record Not Found</h2>
            <p className="text-slate-500 mt-2">The requested intelligence packet has been moved or purged.</p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 transition-all"
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
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-coin-600 transition-colors"
            >
              <ArrowLeft size={16} />
              Return to Intelligence Feed
            </button>
            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">{submission.teamName}</h1>
              <div className="px-3 py-1 bg-coin-500/10 text-coin-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-coin-500/20">
                Active Record
              </div>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-2">
              <Bookmark size={16} className="text-coin-600" />
              {submission.hackathonName}
            </p>
          </div>
          <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
              <Hash size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Entry ID</p>
              <p className="font-mono text-sm font-bold text-coin-600">{submission.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Detailed Composition */}
          <div className="lg:col-span-2 space-y-10">
            {/* Personnel Grid */}
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 md:p-10 shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <Users size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold dark:text-white font-heading">Core Personnel</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Verification level: High</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submission.participants.map((p, idx) => (
                  <div key={idx} className="bg-slate-50 dark:bg-black/20 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 flex items-center justify-center text-slate-300">
                        <Users size={24} />
                      </div>
                      <span className="px-2.5 py-1 bg-white dark:bg-neutral-800 rounded-lg text-[10px] font-bold text-blue-600 uppercase border border-slate-100 dark:border-slate-700">
                        {p.department}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white text-lg">{p.fullName}</p>
                    <div className="mt-4 space-y-2">
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <Mail size={12} className="text-slate-400" />
                        {p.collegeEmail}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-2">
                        <GraduationCap size={12} className="text-slate-400" />
                        {p.academicYear} Academic
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attached Guides */}
            {submission.mentorCount > 0 && (
              <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 md:p-10 shadow-sm">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold dark:text-white font-heading">Institutional Guides</h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Subject matter experts</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {submission.mentors.map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center text-amber-600">
                          <UserCheck size={20} />
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white">{m.name}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-white dark:bg-neutral-800 px-3 py-1 rounded-lg">
                        {m.department}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Metadata & Status */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-[40px] p-8 shadow-sm">
              <h2 className="text-lg font-bold dark:text-white font-heading mb-8">System Telemetry</h2>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logged On</p>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{formatDate(submission.submittedAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">External Status</p>
                    <p className={cn(
                      "text-sm font-bold",
                      submission.externalConfirmed ? "text-green-600" : "text-red-500"
                    )}>
                      {submission.externalConfirmed ? 'Sanctioned & Confirmed' : 'Pending Verification'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400">
                    <Map size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Deployment Nodes</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Array.from(new Set(submission.participants.map(p => p.department))).map(dept => (
                        <span key={dept} className="text-[10px] bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded-md text-slate-500">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button className="w-full py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-coin-500 hover:text-white transition-all">
                    <ExternalLink size={18} />
                    Audit Entry Logs
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-coin-600 rounded-[40px] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform">
                <ShieldCheck size={80} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-coin-200 mb-2">Record Integrity</p>
              <h3 className="text-xl font-bold font-heading mb-4">Official Submission</h3>
              <p className="text-sm text-coin-100 leading-relaxed mb-6">
                This record has been digitally signed and cross-referenced with institutional data. Any modifications must be recorded in the audit trail.
              </p>
              <button className="w-full py-3 bg-white text-coin-600 font-bold rounded-xl text-sm">
                Generate Certificate
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
