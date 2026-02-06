'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="section-heading mb-2">Terms and Conditions</h1>
            <p className="text-gray-600">
              Terms of use for CoIN platform at SREC
            </p>
          </div>
        </section>

        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card p-8 space-y-8">
              <div>
                <h2 className="heading-md mb-4">1. Platform Purpose</h2>
                <p className="text-gray-700">
                  CoIN is an institutional platform created by Sri Ramakrishna Engineering College
                  (SREC) to coordinate hackathons and track student participation in innovation
                  initiatives.
                </p>
              </div>

              <div>
                <h2 className="heading-md mb-4">2. User Eligibility</h2>
                <p className="text-gray-700 mb-3">
                  Students may access CoIN without login to:
                </p>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Browse published hackathons</li>
                  <li>View hackathon details</li>
                  <li>Submit participation reports</li>
                  <li>Read blog posts and announcements</li>
                </ul>
              </div>

              <div>
                <h2 className="heading-md mb-4">3. Admin Access</h2>
                <p className="text-gray-700">
                  Admin functionality is restricted to authorized faculty members. Admin access is
                  password-protected. Admins are responsible for maintaining confidentiality of login
                  credentials.
                </p>
              </div>

              <div>
                <h2 className="heading-md mb-4">4. External Registration</h2>
                <p className="text-gray-700">
                  CoIN does not perform hackathon registrations. Students must register on official
                  hackathon websites as directed. CoIN only collects participation reports after
                  external registration.
                </p>
              </div>

              <div>
                <h2 className="heading-md mb-4">5. Data & Privacy</h2>
                <p className="text-gray-700 mb-3">
                  When you submit participation reports, CoIN collects:
                </p>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Your full name</li>
                  <li>College email address</li>
                  <li>Department and academic year</li>
                  <li>Team information</li>
                  <li>Mentor details (if applicable)</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  This data is used only for institutional tracking of student participation and
                  reporting. Data is maintained securely within SREC's systems.
                </p>
              </div>

              <div>
                <h2 className="heading-md mb-4">6. Submission Accuracy</h2>
                <p className="text-gray-700">
                  By submitting a participation report, you confirm that:
                </p>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Your team registered on the official hackathon website</li>
                  <li>All information provided is accurate and truthful</li>
                  <li>All participants have consented to being listed</li>
                </ul>
              </div>

              <div>
                <h2 className="heading-md mb-4">7. Content Ownership</h2>
                <p className="text-gray-700">
                  Blog posts, announcements, and other content published on CoIN are property of SREC
                  unless otherwise indicated. Students grant SREC permission to feature their
                  achievements and participation in institutional communications.
                </p>
              </div>

              <div>
                <h2 className="heading-md mb-4">8. Acceptable Use</h2>
                <p className="text-gray-700 mb-3">
                  Users agree not to:
                </p>
                <ul className="space-y-2 text-gray-700 list-disc list-inside">
                  <li>Submit false or misleading information</li>
                  <li>Attempt to access unauthorized admin areas</li>
                  <li>Use the platform for purposes other than stated</li>
                  <li>Share login credentials or attempt unauthorized access</li>
                </ul>
              </div>

              <div>
                <h2 className="heading-md mb-4">9. Limitation of Liability</h2>
                <p className="text-gray-700">
                  CoIN is provided as-is. SREC makes no warranties regarding continuous availability,
                  data accuracy, or fitness for particular purposes. SREC is not liable for indirect,
                  incidental, or consequential damages arising from platform use.
                </p>
              </div>

              <div>
                <h2 className="heading-md mb-4">10. Changes to Terms</h2>
                <p className="text-gray-700">
                  SREC reserves the right to update these terms at any time. Continued use of the
                  platform constitutes acceptance of updated terms.
                </p>
              </div>

              <div>
                <h2 className="heading-md mb-4">11. Contact</h2>
                <p className="text-gray-700">
                  For questions regarding these terms or the CoIN platform, contact the SREC
                  administration.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                <p>
                  <strong>Last Updated:</strong> February 2024
                </p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href="/" className="btn-outline">
                Back to Home
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
