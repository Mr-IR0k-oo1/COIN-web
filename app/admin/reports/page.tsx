'use client'

import AdminLayout from '@/components/AdminLayout'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { exportToCSV, downloadCSV, downloadExcel, formatDate, cn } from '@/lib/utils'
import { Download, FileDown, PieChart, BarChart3, Database, ShieldCheck, Info, FileSpreadsheet, FileJson } from 'lucide-react'

export default function ReportsPage() {
  const submissions = useSubmissionStore((state) => state.getAllSubmissions())

  const handleDownloadCSV = () => {
    const csv = exportToCSV(submissions)
    downloadCSV(csv, `flame-intel-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleDownloadExcel = () => {
    downloadExcel(submissions, `flame-intel-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const stats = [
    { label: 'Total Archives', value: submissions.length, icon: Database, color: 'text-ember-500', bg: 'bg-ember-500/10' },
    { label: 'Active Personnel', value: submissions.reduce((sum, s) => sum + s.participantCount, 0), icon: ShieldCheck, color: 'text-flame-500', bg: 'bg-flame-500/10' },
    { label: 'Specialist Units', value: new Set(submissions.flatMap((s) => s.participants?.map((p) => p.department) || [])).size, icon: PieChart, color: 'text-ember-500', bg: 'bg-ember-500/10' },
    { label: 'Guide Nodes', value: submissions.reduce((sum, s) => sum + s.mentorCount, 0), icon: BarChart3, color: 'text-flame-500', bg: 'bg-flame-500/10' },
  ]

  return (
    <AdminLayout>
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h1 className="text-3xl font-bold text-ash-900 dark:text-white font-heading tracking-tight mb-2">
            Data Exfiltration
          </h1>
          <p className="text-ash-500 dark:text-ash-400">
            Export secure datasets for institutional review and analysis
          </p>
        </div>

        {/* Intelligence Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 p-6 rounded-3xl shadow-sm">
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", stat.bg, stat.color)}>
                <stat.icon size={22} />
              </div>
              <p className="text-xs font-bold text-ash-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-ash-900 dark:text-white font-heading">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Export Protocols */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 p-10 rounded-[40px] shadow-sm group hover:border-flame-500/30 transition-all">
            <div className="w-16 h-16 bg-ash-50 dark:bg-ash-900 rounded-2xl flex items-center justify-center text-ash-400 mb-8 group-hover:bg-flame-500 group-hover:text-white transition-all">
              <FileSpreadsheet size={32} />
            </div>
            <h3 className="text-2xl font-bold text-ash-900 dark:text-white mb-4">CSV Protocol</h3>
            <p className="text-ash-500 dark:text-ash-400 text-sm leading-relaxed mb-10">
              Standard comma-separated format for universal compatibility. Ideal for importing into internal database systems or custom scripts.
            </p>
            <button
              onClick={handleDownloadCSV}
              disabled={submissions.length === 0}
              className="w-full flex items-center justify-center gap-2 py-4 bg-ash-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Download size={20} />
              Download CSV Payload
            </button>
          </div>

          <div className="bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 p-10 rounded-[40px] shadow-sm group hover:border-flame-500/30 transition-all">
            <div className="w-16 h-16 bg-ash-50 dark:bg-ash-900 rounded-2xl flex items-center justify-center text-ash-400 mb-8 group-hover:bg-flame-600 group-hover:text-white transition-all">
              <FileDown size={32} />
            </div>
            <h3 className="text-2xl font-bold text-ash-900 dark:text-white mb-4">Excel Manifest</h3>
            <p className="text-ash-500 dark:text-ash-400 text-sm leading-relaxed mb-10">
              Comprehensive spreadsheet format with optimized column structures. Ready for immediate review in Microsoft Excel or Google Sheets.
            </p>
            <button
              onClick={handleDownloadExcel}
              disabled={submissions.length === 0}
              className="w-full flex items-center justify-center gap-2 py-4 border-2 border-ash-200 dark:border-ash-800 text-ash-700 dark:text-ash-300 font-bold rounded-2xl hover:bg-ash-50 dark:hover:bg-white/5 transition-all disabled:opacity-50"
            >
              <FileSpreadsheet size={20} />
              Download Excel Assets
            </button>
          </div>
        </div>

        {/* Schema Preview */}
        <div className="bg-ash-900 dark:bg-ash-950 rounded-[40px] p-10 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-10">
            <FileJson size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-xl font-bold font-heading mb-8 flex items-center gap-3">
              <Info className="text-flame-400" size={20} />
              Data Schema Definition
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-12">
              {[
                { col: 'submission_id', type: 'UUID', desc: 'Unique record key' },
                { col: 'submitted_at', type: 'ISO8601', desc: 'Temporal stamp' },
                { col: 'hackathon_name', type: 'String', desc: 'Opportunity title' },
                { col: 'team_name', type: 'String', desc: 'Unit designation' },
                { col: 'participant_name', type: 'String', desc: 'Personnel identity' },
                { col: 'participant_email', type: 'Email', desc: 'Communication node' },
                { col: 'department', type: 'Enum', desc: 'Functional division' },
                { col: 'academic_year', type: 'Integer', desc: 'Seniority level' },
                { col: 'mentor_nodes', type: 'List', desc: 'Attached guides' },
              ].map((field, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-flame-400 text-sm font-bold">{field.col}</span>
                    <span className="text-[10px] bg-white/10 px-1.5 rounded text-white/50">{field.type}</span>
                  </div>
                  <p className="text-xs text-ash-400">{field.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {submissions.length === 0 && (
          <div className="p-20 text-center bg-white dark:bg-ash-900 border border-dashed border-ash-200 dark:border-ash-800 rounded-[40px]">
            <p className="text-ash-500 font-bold">No telemetry data available for exfiltration.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
