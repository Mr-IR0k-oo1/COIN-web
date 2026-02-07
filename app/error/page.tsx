'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function ErrorPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-20 bg-ash-50 dark:bg-ash-950">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="inline-block w-20 h-20 bg-ember-100 dark:bg-ember-500/20 rounded-full flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-ember-600 dark:text-ember-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <h1 className="section-heading mb-4">Something Went Wrong</h1>
            <p className="text-xl text-ash-600 dark:text-ash-400 mb-8">
              An unexpected error has occurred. Please try again or contact support if the issue
              persists.
            </p>

            <div className="space-y-4">
              <div className="bg-ember-50 dark:bg-ember-500/10 border border-ember-200 dark:border-ember-500/20 rounded-lg p-6 text-left">
                <p className="text-sm text-ember-700 dark:text-ember-300">
                  <strong>Error Code:</strong> 500 - Internal Server Error
                </p>
                <p className="text-sm text-ember-700 dark:text-ember-300 mt-2">
                  Our team has been notified. Please refresh the page or navigate back to a working
                  page.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="btn-primary">
                  Back to Home
                </Link>
                <Link href="/hackathons" className="btn-outline">
                  Browse Hackathons
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
