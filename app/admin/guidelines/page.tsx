'use client'

import AdminLayout from '@/components/AdminLayout'

export default function GuidelinesPage() {
  return (
    <AdminLayout>
      <div className="space-y-8 max-w-4xl">
        <div>
          <h1 className="section-heading mb-2">Admin Guidelines</h1>
          <p className="text-gray-600">Best practices for managing CoIN</p>
        </div>

        <div className="space-y-6">
          {/* Hackathon Management */}
          <div className="card p-8">
            <h2 className="heading-md mb-4">Hackathon Management</h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Publishing Hackathons</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Use clear, descriptive names (e.g., "IoT Innovate 2024")</li>
                  <li>Include comprehensive eligibility criteria</li>
                  <li>Provide direct link to official registration page</li>
                  <li>Set accurate registration deadlines</li>
                  <li>Specify mode (In-Person, Online, Hybrid) and location if applicable</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Status Management</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>
                    <strong>Active:</strong> Registration open, hackathon is current
                  </li>
                  <li>
                    <strong>Upcoming:</strong> Scheduled for future dates
                  </li>
                  <li>
                    <strong>Closed:</strong> Registration closed, hackathon may be running
                  </li>
                  <li>
                    <strong>Completed:</strong> Event has ended
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Participation Tracking */}
          <div className="card p-8">
            <h2 className="heading-md mb-4">Participation Tracking</h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Reviewing Submissions</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Verify participant email addresses are college emails</li>
                  <li>Check team names are appropriate and non-duplicate</li>
                  <li>Confirm external registration was completed (checkbox validation)</li>
                  <li>Review mentor information if applicable</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Metrics to Track</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Student participation by department</li>
                  <li>Mentor involvement rates</li>
                  <li>Year-wise participation distribution</li>
                  <li>Hackathon popularity (submissions per event)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Blog Management */}
          <div className="card p-8">
            <h2 className="heading-md mb-4">Blog Management</h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Creating Posts</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Use informative titles that match content</li>
                  <li>Write clear summaries (1-2 sentences)</li>
                  <li>Categorize posts correctly (Article, Winner, Announcement)</li>
                  <li>Link to related hackathons when applicable</li>
                  <li>Use tags for better searchability</li>
                  <li>Save as Draft before publishing to review</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Content Guidelines</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Maintain institutional tone (no emojis, professional language)</li>
                  <li>For Winner posts: Include team name, hackathon, position</li>
                  <li>For Announcements: Be clear about deadlines and actions</li>
                  <li>Use markdown formatting for readability (## for headings, - for lists)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reporting */}
          <div className="card p-8">
            <h2 className="heading-md mb-4">Reporting & Analytics</h2>

            <div className="space-y-4 text-gray-700">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Exporting Data</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Export formats: CSV and Excel</li>
                  <li>One row per participant (expanded view of teams)</li>
                  <li>Includes all demographic and team information</li>
                  <li>Timestamps show when submission was made</li>
                  <li>External confirmation status is captured</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Using Dashboard Metrics</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Monitor total hackathons and participation trends</li>
                  <li>Track unique students involved in innovation</li>
                  <li>Identify most active departments</li>
                  <li>Review submission timestamps for activity patterns</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Best Practices */}
          <div className="card p-8 bg-blue-50 border border-blue-200">
            <h2 className="heading-md mb-4">Best Practices</h2>

            <div className="space-y-3 text-gray-700 text-sm">
              <p className="flex items-start gap-3">
                <span className="text-coin-600 font-bold">1</span>
                <span>
                  <strong>Regularity:</strong> Publish hackathons well in advance (2-3 weeks
                  minimum before registration opens)
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-coin-600 font-bold">2</span>
                <span>
                  <strong>Communication:</strong> Share blog posts announcing upcoming hackathons
                  and celebrating winners
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-coin-600 font-bold">3</span>
                <span>
                  <strong>Engagement:</strong> Feature success stories from winning teams to
                  motivate future participation
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-coin-600 font-bold">4</span>
                <span>
                  <strong>Data Quality:</strong> Ensure accurate department names and email
                  formats for cleaner reporting
                </span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-coin-600 font-bold">5</span>
                <span>
                  <strong>Cross-Department:</strong> Encourage interdisciplinary participation
                  by highlighting diverse hackathons
                </span>
              </p>
            </div>
          </div>

          {/* Support */}
          <div className="card p-8">
            <h2 className="heading-md mb-4">Support & Issues</h2>

            <div className="space-y-4 text-gray-700 text-sm">
              <p>
                For technical issues or questions about CoIN administration, contact the SREC
                IT department or the innovation committee.
              </p>
              <p className="font-semibold">
                Remember: CoIN is a tool to facilitate and track student innovation. The goal
                is to make participation easy and recognition transparent.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
