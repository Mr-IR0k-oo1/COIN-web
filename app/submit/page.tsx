'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Section from '@/components/ui/Section'
import { ArrowRight, Check } from 'lucide-react'
import { useState, useEffect, Suspense } from 'react'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { Participant, Mentor, AcademicYear, Department } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useStudentStore } from '@/lib/store/studentStore'
import { DEPARTMENTS } from '@/lib/constants/departments'

const ACADEMIC_YEARS: AcademicYear[] = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
]

function SubmitForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hackathons = useHackathonStore((state) => state.hackathons)
  const fetchHackathons = useHackathonStore((state) => state.fetchHackathons)
  const addSubmission = useSubmissionStore((state) => state.addSubmission)

  const [currentStep, setCurrentStep] = useState<'hackathon' | 'team' | 'participants' | 'mentors' | 'review'>(
    'hackathon'
  )
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>(
    searchParams.get('hackathon') || ''
  )
  const [teamName, setTeamName] = useState('')
  const [participantCount, setParticipantCount] = useState(1)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [hasMentor, setHasMentor] = useState(false)
  const [mentorCount, setMentorCount] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const { isAuthenticated, initializeAuth } = useStudentStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/student/login?redirect=/submit')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    fetchHackathons()
  }, [fetchHackathons])

  // Initialize participants array
  useEffect(() => {
    if (participants.length !== participantCount) {
      const newParticipants: Participant[] = []
      for (let i = 0; i < participantCount; i++) {
        newParticipants.push({
          name: participants[i]?.name || '',
          email: participants[i]?.email || '',
          department: participants[i]?.department || 'Computer Science',
          academicYear: participants[i]?.academicYear || 'First Year',
        })
      }
      setParticipants(newParticipants)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantCount])

  // Initialize mentors array
  useEffect(() => {
    if (mentors.length !== mentorCount) {
      const newMentors: Mentor[] = []
      for (let i = 0; i < mentorCount; i++) {
        newMentors.push({
          name: mentors[i]?.name || '',
          department: mentors[i]?.department || 'Computer Science',
        })
      }
      setMentors(newMentors)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorCount])

  const selectedHackathon = hackathons.find((h) => h.id === selectedHackathonId)

  const validateStep = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 'hackathon' && !selectedHackathonId) {
      newErrors.hackathon = 'Please select a hackathon'
    }

    if (currentStep === 'team') {
      if (!teamName.trim()) newErrors.teamName = 'Team name is required'
      if (participantCount < 1 || participantCount > 10) {
        newErrors.participantCount = 'Participant count must be between 1 and 10'
      }
    }

    if (currentStep === 'participants') {
      participants.forEach((p, idx) => {
        if (!p.name.trim()) newErrors[`name_${idx}`] = 'Full name is required'
        if (!p.email.trim()) newErrors[`email_${idx}`] = 'College email is required'
      })

      // Check for duplicate emails
      const emails = participants.map((p) => p.email)
      const duplicates = emails.filter((e, idx) => emails.indexOf(e) !== idx)
      if (duplicates.length > 0) {
        newErrors.duplicateEmail = 'Duplicate email addresses found'
      }
    }

    if (currentStep === 'mentors' && hasMentor) {
      mentors.forEach((m, idx) => {
        if (!m.name.trim()) newErrors[`mentorName_${idx}`] = 'Mentor name is required'
      })
    }

    if (currentStep === 'review' && !confirmed) {
      newErrors.confirmed = 'You must confirm external registration'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validateStep()) return

    if (currentStep === 'hackathon') setCurrentStep('team')
    else if (currentStep === 'team') setCurrentStep('participants')
    else if (currentStep === 'participants') setCurrentStep('mentors')
    else if (currentStep === 'mentors') setCurrentStep('review')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBack = () => {
    if (currentStep === 'team') setCurrentStep('hackathon')
    else if (currentStep === 'participants') setCurrentStep('team')
    else if (currentStep === 'mentors') setCurrentStep('participants')
    else if (currentStep === 'review') setCurrentStep('mentors')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    if (!selectedHackathon) return

    try {
      const submission: any = {
        hackathonId: selectedHackathonId,
        teamName: teamName,
        externalConfirmed: true,
        participants,
        mentors: hasMentor ? mentors : [],
      }

      const submissionId = await addSubmission(submission)
      router.push(`/success?id=${submissionId}`)
    } catch (err: any) {
      setErrors({
        submit: err.message || 'Failed to submit participation',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const steps = ['hackathon', 'team', 'participants', 'mentors', 'review'] as const
  const currentStepIndex = steps.indexOf(currentStep)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-heading font-bold text-ash-900 dark:text-white mb-2">Report Participation</h1>
        <p className="text-ash-600 dark:text-ash-400">Track your innovation journey with CoIN.</p>
      </div>

      <div className="mb-16">
        <div className="relative flex items-center justify-between px-2">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1.5 bg-ash-200 dark:bg-ash-900 -z-0 rounded-full" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-gradient-to-r from-flame-600 to-ember-600 transition-all duration-700 ease-out z-0 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />

          {steps.map((step, idx) => {
            const isCompleted = currentStepIndex > idx
            const isCurrent = currentStepIndex === idx

            return (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold border-2 transition-all duration-500 transform",
                  isCompleted ? "bg-flame-600 border-flame-600 text-white scale-110 shadow-lg" :
                    isCurrent ? "bg-white dark:bg-ash-900 border-flame-500 text-flame-600 shadow-2xl ring-4 ring-flame-500/20 scale-125" :
                      "bg-white dark:bg-ash-950 border-ash-200 dark:border-ash-700 text-ash-400"
                )}>
                  {isCompleted ? <Check className="h-5 w-5" /> : idx + 1}
                </div>
                <span className={cn(
                  "absolute top-16 text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-500",
                  isCurrent ? "text-flame-600 dark:text-flame-400 opacity-100 translate-y-0" : "text-ash-400 opacity-60 translate-y-1"
                )}>
                  {step}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="glass-premium rounded-[2.5rem] overflow-hidden">
        <div className="relative z-10 p-8 md:p-12 h-full">
          {currentStepIndex === 0 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold font-heading text-ash-900 mb-6 dark:text-white">Select Hackathon</h2>
              {hackathons.length === 0 ? (
                <div className="text-center py-12 bg-ash-50 dark:bg-ash-900 rounded-xl border border-dashed border-ash-200 dark:border-ash-800">
                  <p className="text-ash-600 dark:text-ash-400 mb-2">No hackathons available</p>
                  <p className="text-sm text-ash-500">Check back later for new opportunities.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hackathons.map((h) => (
                    <label
                      key={h.id}
                      className={cn(
                        "flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 text-left",
                        selectedHackathonId === h.id
                          ? "border-flame-500 bg-flame-50 dark:bg-flame-500/10 shadow-sm ring-1 ring-flame-200"
                          : "border-ash-200 dark:border-ash-800 hover:border-flame-200 hover:bg-ash-50 dark:hover:bg-white/5"
                      )}
                    >
                      <input
                        type="radio"
                        name="hackathon"
                        value={h.id}
                        checked={selectedHackathonId === h.id}
                        onChange={(e) => setSelectedHackathonId(e.target.value)}
                        className="mr-4 w-4 h-4 text-flame-600 border-ash-300 focus:ring-flame-500"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-ash-900 dark:text-white">{h.name}</p>
                        <p className="text-sm text-ash-500 dark:text-ash-400">{h.organizer}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {errors.hackathon && <p className="text-ember-600 text-sm mt-4 flex items-center gap-1">{errors.hackathon}</p>}
            </div>
          )}

          {currentStepIndex === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold font-heading text-ash-900 mb-6 dark:text-white">Team Details</h2>
              <div className="mb-6 space-y-2">
                <label className="text-xs font-bold text-ash-400 uppercase tracking-widest ml-1">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team X"
                  className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl outline-none"
                />
                {errors.teamName && <p className="text-ember-600 text-sm mt-2">{errors.teamName}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-ash-400 uppercase tracking-widest ml-1">Participants (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={participantCount}
                  onChange={(e) => setParticipantCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                  className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl outline-none"
                />
                {errors.participantCount && <p className="text-ember-600 text-sm mt-2">{errors.participantCount}</p>}
              </div>
            </div>
          )}

          {currentStepIndex === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold font-heading text-ash-900 mb-6 dark:text-white">Participant Records</h2>
              <div className="space-y-8">
                {participants.map((p, idx) => (
                  <div key={idx} className="p-6 bg-ash-50 dark:bg-ash-900 rounded-3xl border border-ash-200 dark:border-ash-800 space-y-6">
                    <p className="text-xs font-bold text-ash-400 uppercase tracking-widest">Participant {idx + 1}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ash-500 dark:text-ash-400">Full Name</label>
                        <input
                          type="text"
                          value={p.name}
                          onChange={(e) => {
                            const updated = [...participants]
                            updated[idx].name = e.target.value
                            setParticipants(updated)
                          }}
                          className="w-full px-4 py-2 border rounded-xl outline-none dark:bg-ash-900 dark:border-ash-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ash-500 dark:text-ash-400">College Email</label>
                        <input
                          type="email"
                          value={p.email}
                          onChange={(e) => {
                            const updated = [...participants]
                            updated[idx].email = e.target.value
                            setParticipants(updated)
                          }}
                          className="w-full px-4 py-2 border rounded-xl outline-none dark:bg-ash-900 dark:border-ash-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ash-500 dark:text-ash-400">Department</label>
                        <select
                          value={p.department}
                          onChange={(e) => {
                            const updated = [...participants]
                            updated[idx].department = e.target.value as any
                            setParticipants(updated)
                          }}
                          className="w-full px-4 py-2 border rounded-xl outline-none dark:bg-ash-900 dark:border-ash-700"
                        >
                          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-ash-500 dark:text-ash-400">Academic Year</label>
                        <select
                          value={p.academicYear}
                          onChange={(e) => {
                            const updated = [...participants]
                            updated[idx].academicYear = e.target.value as any
                            setParticipants(updated)
                          }}
                          className="w-full px-4 py-2 border rounded-xl outline-none dark:bg-ash-900 dark:border-ash-700"
                        >
                          {ACADEMIC_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.duplicateEmail && <p className="text-ember-500 text-sm mt-6 text-center">{errors.duplicateEmail}</p>}
            </div>
          )}

          {currentStepIndex === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold font-heading text-ash-900 mb-6 dark:text-white">Mentor Intelligence</h2>
              <label className="flex items-center gap-3 p-4 border border-ash-200 dark:border-ash-800 rounded-2xl cursor-pointer hover:bg-ash-50 dark:hover:bg-white/5 transition-all">
                <input
                  type="checkbox"
                  checked={hasMentor}
                  onChange={(e) => {
                    setHasMentor(e.target.checked)
                    if (!e.target.checked) setMentorCount(0)
                    else if (mentorCount === 0) setMentorCount(1)
                  }}
                  className="w-5 h-5 text-flame-600"
                />
                <span className="font-bold text-ash-700 dark:text-ash-300">Our team is guided by a mentor</span>
              </label>

              {hasMentor && (
                <div className="mt-8 space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-ash-400 uppercase tracking-widest ml-1">Mentor Count</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={mentorCount}
                      onChange={(e) => setMentorCount(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                      className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl outline-none font-bold"
                    />
                  </div>
                  {mentors.map((m, idx) => (
                    <div key={idx} className="p-6 border border-ash-100 dark:border-ash-800 rounded-3xl space-y-4">
                      <p className="text-xs font-bold text-ash-300 uppercase tracking-widest">Mentor Node {idx + 1}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-ash-500">Full Name</label>
                          <input
                            type="text"
                            value={m.name}
                            onChange={(e) => {
                              const updated = [...mentors]
                              updated[idx].name = e.target.value
                              setMentors(updated)
                            }}
                            className="w-full px-4 py-2 border rounded-xl outline-none dark:bg-ash-900 dark:border-ash-700"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-ash-500">Department</label>
                          <select
                            value={m.department}
                            onChange={(e) => {
                              const updated = [...mentors]
                              updated[idx].department = e.target.value as any
                              setMentors(updated)
                            }}
                            className="w-full px-4 py-2 border rounded-xl outline-none dark:bg-ash-900 dark:border-ash-700"
                          >
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentStepIndex === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold font-heading text-ash-900 mb-6 dark:text-white">Review Transmission</h2>
              <div className="space-y-4">
                <div className="p-6 bg-ash-50 dark:bg-ash-900 rounded-3xl border border-ash-100 dark:border-ash-800">
                  <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest mb-1">Target Opportunity</p>
                  <p className="font-bold text-ash-900 dark:text-white text-lg">{selectedHackathon?.name}</p>
                </div>
                <div className="p-6 bg-ash-50 dark:bg-ash-900 rounded-3xl border border-ash-100 dark:border-ash-800">
                  <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest mb-1">Team Identity</p>
                  <p className="font-bold text-ash-900 dark:text-white text-lg">{teamName}</p>
                </div>
                <div className="p-6 bg-ash-50 dark:bg-ash-900 rounded-3xl border border-ash-100 dark:border-ash-800">
                  <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest mb-4">Operational Nodes ({participantCount})</p>
                  <div className="space-y-3">
                    {participants.map((p, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="font-bold dark:text-white">{p.name}</span>
                        <span className="text-ash-500 font-mono tracking-tight">{p.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <label className="flex items-start gap-4 p-6 bg-ember-50 dark:bg-ember-500/10 border border-ember-100 dark:border-ember-500/20 rounded-3xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
                <span className="text-sm font-medium text-ember-800 dark:text-ember-300 leading-relaxed">
                  I confirm that our team has completed official registration on the external platform. I verify that this CoIN transmission is for institutional record-keeping and internal resource allocation at SREC.
                </span>
              </label>
              {errors.confirmed && <p className="text-ember-500 text-sm">{errors.confirmed}</p>}
            </div>
          )}

          <div className="flex justify-between gap-4 mt-16 pt-10 border-t border-ash-100 dark:border-ash-800">
            <button
              onClick={handleBack}
              disabled={currentStepIndex === 0}
              className="px-10 py-4 rounded-2xl font-bold text-ash-400 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-ash-50 dark:hover:bg-white/5 disabled:opacity-0 transition-all duration-300"
            >
              ← Previous
            </button>
            {currentStepIndex < 4 ? (
              <button
                onClick={handleNext}
                className="group/btn px-12 py-4 bg-ash-900 dark:bg-flame-600 text-white font-bold rounded-2xl hover:bg-ash-800 dark:hover:bg-flame-500 hover:scale-105 active:scale-95 transition-all duration-300 shadow-2xl shadow-flame-500/20 flex items-center"
              >
                Commit Step
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="group/btn px-14 py-4 bg-gradient-to-r from-flame-600 to-ember-600 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_10px_40px_rgba(99,102,241,0.3)] flex items-center"
              >
                Propagate Records
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubmitPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-white dark:bg-ash-950 min-h-screen">
        <Section variant="grid" className="pt-40 pb-32">
          <Suspense fallback={<div className="flex items-center justify-center p-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flame-600"></div></div>}>
            <SubmitForm />
          </Suspense>
        </Section>
      </main>
      <Footer />
    </>
  )
}
