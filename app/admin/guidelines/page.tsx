'use client'

import AdminLayout from '@/components/AdminLayout'
import { BookOpen, Shield, Target, Zap, Heart, MessageSquare, AlertCircle, CheckCircle2, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function GuidelinesPage() {
  const sections = [
    {
      title: "Opportunity Lifecycle",
      icon: Target,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      rules: [
        "Names must be descriptive and institutional (e.g., 'National IoT Summit 2.0')",
        "Always verify eligibility criteria with the department heads",
        "Registration links must point directly to the official platform",
        "Status 'Active' should only be set when registration is actually open"
      ]
    },
    {
      title: "Intelligence Integrity",
      icon: Shield,
      color: "text-green-500",
      bg: "bg-green-500/10",
      rules: [
        "Participant domains must strictly be @srec.edu.in",
        "Team names are subject to moderation for appropriateness",
        "External registration confirmation is mandatory for all entries",
        "Duplicate submissions should be flagged and merged"
      ]
    },
    {
      title: "Broadcasting Standards",
      icon: Zap,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      rules: [
        "Professional tone (Institutional voice, no slang)",
        "Winner posts must feature all team members and their specific roles",
        "Use high-quality markdown for structured long-form content",
        "Include relevant tags for the global search index"
      ]
    },
    {
      title: "Operational Ethics",
      icon: Heart,
      color: "text-red-500",
      bg: "bg-red-500/10",
      rules: [
        "Protect student privacy in all publicly broadcasted data",
        "Ensure fair representation across all departments",
        "Respond to student queries via official channels within 24h",
        "Maintain current and accurate timelines for all events"
      ]
    }
  ]

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-coin-500/10 text-coin-600 rounded-full text-xs font-bold uppercase tracking-widest border border-coin-500/20">
            <BookOpen size={14} />
            Operating Procedures
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">
            The CoIN <span className="text-gradient">Protocol</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Governing principles and operational guidelines for the SREC Innovation Ecosystem.
            Follow these standards to maintain system integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all">
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6", section.bg, section.color)}>
                <section.icon size={26} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 font-heading">{section.title}</h2>
              <ul className="space-y-4">
                {section.rules.map((rule, ridx) => (
                  <li key={ridx} className="flex items-start gap-4">
                    <CheckCircle2 className="text-slate-300 dark:text-slate-700 mt-1 flex-shrink-0" size={18} />
                    <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Support Vector */}
        <div className="bg-slate-900 dark:bg-neutral-950 rounded-[40px] p-10 text-white overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center text-coin-400 flex-shrink-0">
              <MessageSquare size={40} />
            </div>
            <div className="space-y-4 text-center md:text-left">
              <h3 className="text-2xl font-bold font-heading">Protocol Deviation?</h3>
              <p className="text-slate-400 max-w-xl">
                If you encounter scenarios not covered by this manual or system failures,
                contact the Central Innovation Committee immediately. Do not attempt unsanctioned modifications.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
                <button className="px-6 py-2 bg-white text-black font-bold rounded-xl hover:scale-105 transition-all text-sm">
                  Contact Support
                </button>
                <button className="px-6 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all text-sm flex items-center gap-2">
                  <Flag size={14} /> Report Violation
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Warning */}
        <div className="flex items-center justify-center gap-3 text-slate-400 text-xs font-bold uppercase tracking-[0.3em] py-10 opacity-50">
          <AlertCircle size={14} />
          Restricted to Level 3 Administrative Personnel
        </div>
      </div>
    </AdminLayout>
  )
}
