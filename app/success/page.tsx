'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useSubmissionStore } from '@/lib/store/submissionStore'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const submissionId = searchParams.get('id')
  const submission = useSubmissionStore((state) =>
    state.getSubmissionById(submissionId || '')
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <h1 className="section-heading mb-4">Participation Submitted</h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for reporting your hackathon participation.
            </p>

            {submission && (
              <div className="card p-8 mb-8">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">Submission ID</p>
                  <p className="text-2xl font-mono font-bold text-coin-600">{submission.id}</p>
                </div>

                <div className="space-y-4 text-left bg-gray-50 p-6 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Hackathon</strong>
                    </p>
                    <p className="text-gray-900">{submission.hackathonName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Team</strong>
                    </p>
                    <p className="text-gray-900">{submission.teamName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Participants</strong>
                    </p>
                    <p className="text-gray-900">{submission.participantCount}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start gap-3">
                  <span className="text-coin-600 font-bold mt-1">1</span>
                  <span>Your participation has been recorded in CoIN</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-coin-600 font-bold mt-1">2</span>
                  <span>Admins will review and validate your submission</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-coin-600 font-bold mt-1">3</span>
                  <span>If your team wins, it may be featured in our blog</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-coin-600 font-bold mt-1">4</span>
                  <span>Check back on CoIN to see your achievements</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-primary">
                Back to Home
              </Link>
              <Link href="/blog" className="btn-secondary">
                Read Success Stories
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
