'use client'

import AdminLayout from '@/components/AdminLayout'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { useRouter } from 'next/navigation'
import { formatDate } from '@/lib/utils'

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
        <div className="text-center py-12">
          <h2 className="heading-md mb-4">Submission Not Found</h2>
          <button
            onClick={() => router.back()}
            className="btn-primary"
          >
            Back
          </button>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="text-coin-600 hover:text-coin-700 font-medium text-sm mb-4 block"
            >
              ← Back
            </button>
            <h1 className="section-heading mb-2">{submission.teamName}</h1>
            <p className="text-gray-600">{submission.hackathonName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">Submission ID</p>
            <p className="font-mono text-lg font-bold text-coin-600">{submission.id}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Team Summary */}
            <div className="card p-6">
              <h2 className="heading-md mb-4">Team Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Team Name</span>
                  <span className="font-medium text-gray-900">{submission.teamName}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Hackathon</span>
                  <span className="font-medium text-gray-900">{submission.hackathonName}</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Number of Participants</span>
                  <span className="font-medium text-gray-900">{submission.participantCount}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Number of Mentors</span>
                  <span className="font-medium text-gray-900">{submission.mentorCount}</span>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="card p-6">
              <h2 className="heading-md mb-4">Participants ({submission.participantCount})</h2>
              <div className="space-y-4">
                {submission.participants.map((p, idx) => (
                  <div key={idx} className="pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{p.fullName}</p>
                        <p className="text-sm text-gray-600">{p.collegeEmail}</p>
                      </div>
                      <span className="text-xs bg-coin-50 text-coin-700 px-3 py-1 rounded-full">
                        {p.department}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{p.academicYear}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentors */}
            {submission.mentorCount > 0 && (
              <div className="card p-6">
                <h2 className="heading-md mb-4">Mentors ({submission.mentorCount})</h2>
                <div className="space-y-4">
                  {submission.mentors.map((m, idx) => (
                    <div key={idx} className="pb-4 border-b border-gray-200 last:border-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-900">{m.name}</p>
                        </div>
                        <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full">
                          {m.department}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="heading-md mb-4">Metadata</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Submission Date</strong>
                  </p>
                  <p className="text-gray-900">{formatDate(submission.submittedAt)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>External Confirmed</strong>
                  </p>
                  <p
                    className={`font-medium ${
                      submission.externalConfirmed
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {submission.externalConfirmed ? 'Yes' : 'No'}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-700">
                    <p className="font-semibold mb-2">Departments</p>
                    <div className="space-y-1">
                      {Array.from(
                        new Set(submission.participants.map((p) => p.department))
                      ).map((dept) => (
                        <p key={dept}>{dept}</p>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 text-sm text-purple-700">
                  <p className="font-semibold mb-2">Academic Years</p>
                  <div className="space-y-1">
                    {Array.from(
                      new Set(submission.participants.map((p) => p.academicYear))
                    ).map((year) => (
                      <p key={year}>{year}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
