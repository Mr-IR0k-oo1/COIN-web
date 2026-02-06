'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, useEffect } from 'react'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { useRouter, useSearchParams } from 'next/navigation'
import { generateSubmissionId } from '@/lib/utils'
import { Participant, Mentor, AcademicYear, Department } from '@/lib/types'
import Section from '@/components/ui/Section'
import { cn } from '@/lib/utils'

const DEPARTMENTS: Department[] = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical',
  'Electrical',
  'Civil',
  'Chemical',
]

const ACADEMIC_YEARS: AcademicYear[] = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year',
]

export default function SubmitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hackathons = useHackathonStore((state) => state.getAllHackathons())
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

  // Initialize participants array
  useEffect(() => {
    const newParticipants: Participant[] = []
    for (let i = 0; i < participantCount; i++) {
      newParticipants.push({
        fullName: participants[i]?.fullName || '',
        collegeEmail: participants[i]?.collegeEmail || '',
        department: participants[i]?.department || 'Computer Science',
        academicYear: participants[i]?.academicYear || 'First Year',
      })
    }
    setParticipants(newParticipants)
  }, [participantCount])

  // Initialize mentors array
  useEffect(() => {
    const newMentors: Mentor[] = []
    for (let i = 0; i < mentorCount; i++) {
      newMentors.push({
        name: mentors[i]?.name || '',
        department: mentors[i]?.department || 'Computer Science',
      })
    }
    setMentors(newMentors)
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
        if (!p.fullName.trim()) newErrors[`fullName_${idx}`] = 'Full name is required'
        if (!p.collegeEmail.trim()) newErrors[`email_${idx}`] = 'College email is required'
      })

      // Check for duplicate emails
      const emails = participants.map((p) => p.collegeEmail)
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

  const handleSubmit = () => {
    if (!validateStep()) return
    if (!selectedHackathon) return

    const submission = {
      id: generateSubmissionId(),
      hackathonId: selectedHackathonId,
      hackathonName: selectedHackathon.name,
      teamName,
      participantCount,
      mentorCount: hasMentor ? mentorCount : 0,
      participants,
      mentors: hasMentor ? mentors : [],
      externalConfirmed: true,
      submittedAt: new Date().toISOString(),
    }

    addSubmission(submission)
    router.push(`/success?id=${submission.id}`)
  }

  const steps = ['hackathon', 'team', 'participants', 'mentors', 'review'] as const
  const currentStepIndex = steps.indexOf(currentStep)

  return (
    <>
      <Header />
      <main className="flex-1 bg-slate-50 min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Report Participation</h1>
            <p className="text-slate-600">Track your innovation journey with CoIN.</p>
          </div>

          {/* Enhanced Progress Indicator */}
          <div className="mb-10">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-0 rounded-full" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-coin-500 transition-all duration-500 ease-out z-0 rounded-full"
                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, idx) => {
                const isCompleted = currentStepIndex > idx
                const isCurrent = currentStepIndex === idx

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                      isCompleted ? "bg-coin-500 border-coin-500 text-white" :
                        isCurrent ? "bg-white border-coin-500 text-coin-600 shadow-md ring-4 ring-coin-100" :
                          "bg-white border-slate-200 text-slate-400"
                    )}>
                      {isCompleted ? '✓' : idx + 1}
                    </div>
                    <span className={cn(
                      "absolute top-10 text-xs font-medium capitalize whitespace-nowrap transition-colors duration-300",
                      isCurrent ? "text-coin-700" : "text-slate-400"
                    )}>
                      {step}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
            {/* Hackathon Selection */}
            {currentStep === 'hackathon' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Select Hackathon</h2>

                {hackathons.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-slate-600 mb-2">No hackathons available</p>
                    <p className="text-sm text-slate-500">Check back later for new opportunities.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {hackathons.map((h) => (
                      <label
                        key={h.id}
                        className={cn(
                          "flex items-center p-4 border rounded-xl cursor-pointer transition-all duration-200 text-left",
                          selectedHackathonId === h.id
                            ? "border-coin-500 bg-coin-50 shadow-sm ring-1 ring-coin-200"
                            : "border-slate-200 hover:border-coin-200 hover:bg-slate-50"
                        )}
                      >
                        <input
                          type="radio"
                          name="hackathon"
                          value={h.id}
                          checked={selectedHackathonId === h.id}
                          onChange={(e) => setSelectedHackathonId(e.target.value)}
                          className="mr-4 w-4 h-4 text-coin-600 border-slate-300 focus:ring-coin-500"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{h.name}</p>
                          <p className="text-sm text-slate-500">{h.organizer}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}

                {errors.hackathon && <p className="text-red-600 text-sm mt-4 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">!</span>
                  {errors.hackathon}
                </p>}
              </div>
            )}

            {/* Team Information */}
            {currentStep === 'team' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Team Details</h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors"
                  />
                  {errors.teamName && <p className="text-red-600 text-sm mt-2">{errors.teamName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Number of Participants (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={participantCount}
                    onChange={(e) => setParticipantCount(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors"
                  />
                  {errors.participantCount && (
                    <p className="text-red-600 text-sm mt-2">{errors.participantCount}</p>
                  )}
                </div>
              </div>
            )}

            {/* Participants */}
            {currentStep === 'participants' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold font-heading text-slate-900 mb-2">Participant Details</h2>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-6 text-sm text-amber-800">
                  Please provide accurate information for all {participantCount} participant(s). This will be used for certificates.
                </div>

                <div className="space-y-8">
                  {participants.map((participant, idx) => (
                    <div key={idx} className="pb-8 border-b border-slate-100 last:border-0">
                      <h3 className="text-sm uppercase tracking-wide font-bold text-slate-400 mb-4">Participant {idx + 1}</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={participant.fullName}
                            onChange={(e) => {
                              const newParticipants = [...participants]
                              newParticipants[idx].fullName = e.target.value
                              setParticipants(newParticipants)
                            }}
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors"
                          />
                          {errors[`fullName_${idx}`] && (
                            <p className="text-red-600 text-sm mt-1">{errors[`fullName_${idx}`]}</p>
                          )}
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 mb-1">College Email</label>
                          <input
                            type="email"
                            value={participant.collegeEmail}
                            onChange={(e) => {
                              const newParticipants = [...participants]
                              newParticipants[idx].collegeEmail = e.target.value
                              setParticipants(newParticipants)
                            }}
                            placeholder="name@srec.edu.in"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors"
                          />
                          {errors[`email_${idx}`] && (
                            <p className="text-red-600 text-sm mt-1">{errors[`email_${idx}`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                          <select
                            value={participant.department}
                            onChange={(e) => {
                              const newParticipants = [...participants]
                              newParticipants[idx].department = e.target.value as Department
                              setParticipants(newParticipants)
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors bg-white"
                          >
                            {DEPARTMENTS.map((dept) => (
                              <option key={dept} value={dept}>
                                {dept}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                          <select
                            value={participant.academicYear}
                            onChange={(e) => {
                              const newParticipants = [...participants]
                              newParticipants[idx].academicYear = e.target.value as AcademicYear
                              setParticipants(newParticipants)
                            }}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors bg-white"
                          >
                            {ACADEMIC_YEARS.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {errors.duplicateEmail && (
                  <p className="text-red-600 text-sm mt-6 text-center bg-red-50 p-3 rounded-lg border border-red-100">{errors.duplicateEmail}</p>
                )}
              </div>
            )}

            {/* Mentors */}
            {currentStep === 'mentors' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Mentor Information</h2>

                <div className="mb-6">
                  <label className="flex items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={hasMentor}
                      onChange={(e) => {
                        setHasMentor(e.target.checked)
                        if (!e.target.checked) setMentorCount(0)
                      }}
                      className="w-5 h-5 text-coin-600 border-slate-300 focus:ring-coin-500 rounded"
                    />
                    <span className="text-slate-900 font-medium">Our team has faculty mentor(s)</span>
                  </label>
                </div>

                {hasMentor && (
                  <div className="animate-in fade-in duration-300">
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Number of Mentors (0-5)</label>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        value={mentorCount}
                        onChange={(e) => setMentorCount(Math.max(0, Math.min(5, parseInt(e.target.value) || 0)))}
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors"
                      />
                    </div>

                    {mentorCount > 0 && (
                      <div className="space-y-6">
                        {mentors.map((mentor, idx) => (
                          <div key={idx} className="pb-6 border-b border-slate-100 last:border-0">
                            <h3 className="text-sm uppercase tracking-wide font-bold text-slate-400 mb-4">Mentor {idx + 1}</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input
                                  type="text"
                                  value={mentor.name}
                                  onChange={(e) => {
                                    const newMentors = [...mentors]
                                    newMentors[idx].name = e.target.value
                                    setMentors(newMentors)
                                  }}
                                  placeholder="Mentor Name"
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors"
                                />
                                {errors[`mentorName_${idx}`] && (
                                  <p className="text-red-600 text-sm mt-1">{errors[`mentorName_${idx}`]}</p>
                                )}
                              </div>

                              <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                                <select
                                  value={mentor.department}
                                  onChange={(e) => {
                                    const newMentors = [...mentors]
                                    newMentors[idx].department = e.target.value as Department
                                    setMentors(newMentors)
                                  }}
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-colors bg-white"
                                >
                                  {DEPARTMENTS.map((dept) => (
                                    <option key={dept} value={dept}>
                                      {dept}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Review */}
            {currentStep === 'review' && selectedHackathon && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h2 className="text-xl font-bold font-heading text-slate-900 mb-6">Review Submission</h2>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hackathon</h3>
                      <p className="text-lg font-bold text-slate-900">{selectedHackathon.name}</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Team</h3>
                      <p className="text-lg font-bold text-slate-900">{teamName}</p>
                    </div>

                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Participants ({participantCount})</h3>
                      </div>
                      <div className="space-y-3">
                        {participants.map((p, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row md:justify-between md:items-center text-sm border-b border-slate-200/50 last:border-0 pb-2 last:pb-0">
                            <div>
                              <p className="font-bold text-slate-800">{p.fullName}</p>
                              <p className="text-slate-500">{p.collegeEmail}</p>
                            </div>
                            <div className="text-slate-500 text-right mt-1 md:mt-0">
                              <p>{p.department}</p>
                              <p className="text-xs">{p.academicYear}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {hasMentor && mentorCount > 0 && (
                      <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Mentors ({mentorCount})</h3>
                        <div className="space-y-3">
                          {mentors.map((m, idx) => (
                            <div key={idx} className="text-sm text-slate-700">
                              <p>
                                <strong>{m.name}</strong> ({m.department})
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                      <label className="flex items-start gap-4 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={confirmed}
                          onChange={(e) => setConfirmed(e.target.checked)}
                          className="w-5 h-5 text-coin-600 border-blue-300 focus:ring-blue-500 rounded mt-0.5"
                        />
                        <span className="text-sm text-blue-900 leading-relaxed font-medium">
                          I confirm that we have registered on the official hackathon website. I understand that submitting this form on CoIN is ONLY for internal tracking at SREC and does not register us for the event itself.
                        </span>
                      </label>
                      {errors.confirmed && (
                        <p className="text-red-600 text-sm mt-3 ml-9 font-medium">{errors.confirmed}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex justify-between gap-4 mt-10 pt-6 border-t border-slate-100">
              <button
                onClick={handleBack}
                disabled={currentStep === 'hackathon'}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
              >
                Back
              </button>

              {currentStep !== 'review' ? (
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-2.5 rounded-lg text-sm font-bold text-white bg-coin-600 hover:bg-coin-700 transition-all shadow-lg shadow-coin-600/20 active:scale-95"
                >
                  Submit Participation
                </button>
              )}
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
