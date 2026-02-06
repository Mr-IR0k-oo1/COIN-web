'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default function HackathonDetailPage({ params }: PageProps) {
  const router = useRouter()
  const hackathon = useHackathonStore((state) => state.getHackathonBySlug(params.slug))

  if (!hackathon) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="section-heading mb-4">Hackathon Not Found</h1>
              <p className="text-gray-600 mb-8">
                The hackathon you're looking for does not exist.
              </p>
              <Link href="/hackathons" className="btn-primary">
                Back to Hackathons
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => router.back()}
              className="text-coin-600 hover:text-coin-700 font-medium text-sm mb-6"
            >
              ← Back
            </button>
            <h1 className="section-heading mb-2">{hackathon.name}</h1>
            <p className="text-gray-600">by {hackathon.organizer}</p>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Overview */}
                <div className="card p-8 mb-8">
                  <h2 className="heading-md mb-4">Overview</h2>
                  <p className="text-gray-700 mb-6">{hackathon.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 pt-6 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Mode</strong>
                      </p>
                      <p className="text-gray-900">{hackathon.mode}</p>
                    </div>
                    {hackathon.location && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Location</strong>
                        </p>
                        <p className="text-gray-900">{hackathon.location}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Semester</strong>
                      </p>
                      <p className="text-gray-900">{hackathon.semester}</p>
                    </div>
                  </div>
                </div>

                {/* Important Dates */}
                <div className="card p-8 mb-8">
                  <h2 className="heading-md mb-4">Important Dates</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-700">
                        <strong>Start Date</strong>
                      </span>
                      <span className="text-gray-900">{formatDate(hackathon.startDate)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-gray-700">
                        <strong>End Date</strong>
                      </span>
                      <span className="text-gray-900">{formatDate(hackathon.endDate)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                      <span className="text-gray-700">
                        <strong>Registration Deadline</strong>
                      </span>
                      <span className="text-red-600 font-medium">
                        {formatDate(hackathon.registrationDeadline)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Eligibility */}
                <div className="card p-8 mb-8">
                  <h2 className="heading-md mb-4">Eligibility</h2>
                  <p className="text-gray-700">{hackathon.eligibility}</p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="card p-8 sticky top-8">
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Status</strong>
                    </p>
                    <span
                      className={`badge ${
                        hackathon.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : hackathon.status === 'Upcoming'
                            ? 'bg-blue-100 text-blue-700'
                            : hackathon.status === 'Closed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {hackathon.status}
                    </span>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                        Important
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                        <p>
                          <strong>Register on the official hackathon website</strong>, then submit
                          participation on CoIN.
                        </p>
                      </div>
                    </div>

                    <div>
                      <a
                        href={hackathon.officialLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary block text-center"
                      >
                        Visit Official Website
                      </a>
                    </div>

                    <div>
                      <Link href={`/submit?hackathon=${hackathon.id}`} className="btn-secondary block text-center">
                        Report Participation
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
