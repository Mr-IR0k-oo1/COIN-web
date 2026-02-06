'use client'

import AdminLayout from '@/components/AdminLayout'
import { useSubmissionStore } from '@/lib/store/submissionStore'
import { exportToCSV, downloadCSV, downloadExcel } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export default function ReportsPage() {
  const submissions = useSubmissionStore((state) => state.getAllSubmissions())

  const handleDownloadCSV = () => {
    const csv = exportToCSV(submissions)
    downloadCSV(csv, `coin-participation-${new Date().toISOString().split('T')[0]}.csv`)
  }

  const handleDownloadExcel = () => {
    downloadExcel(submissions, `coin-participation-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="section-heading mb-2">Reports</h1>
          <p className="text-gray-600">Export participation data for analysis</p>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-8">
            <h3 className="heading-md mb-4">Export as CSV</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Download all participation data in CSV format. Compatible with spreadsheet
              applications.
            </p>
            <button onClick={handleDownloadCSV} className="btn-primary w-full">
              Download CSV
            </button>
          </div>

          <div className="card p-8">
            <h3 className="heading-md mb-4">Export as Excel</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Download all participation data in Excel format. Ready for analysis and
              reporting.
            </p>
            <button onClick={handleDownloadExcel} className="btn-primary w-full">
              Download Excel
            </button>
          </div>
        </div>

        {/* Data Preview */}
        <div className="card p-6">
          <h3 className="heading-md mb-4">Data Summary</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
              <p className="text-3xl font-bold text-gray-900">{submissions.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Participants</p>
              <p className="text-3xl font-bold text-gray-900">
                {submissions.reduce((sum, s) => sum + s.participantCount, 0)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Mentors</p>
              <p className="text-3xl font-bold text-gray-900">
                {submissions.reduce((sum, s) => sum + s.mentorCount, 0)}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Unique Departments</p>
              <p className="text-3xl font-bold text-gray-900">
                {new Set(
                  submissions.flatMap((s) => s.participants.map((p) => p.department))
                ).size}
              </p>
            </div>
          </div>

          {/* Preview Table */}
          {submissions.length > 0 && (
            <div className="mt-8">
              <h4 className="font-semibold text-gray-900 mb-4">Export Columns</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left font-semibold">Column Name</th>
                      <th className="px-3 py-2 text-left font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { col: 'submission_id', desc: 'Unique submission identifier' },
                      { col: 'submitted_at', desc: 'Date and time of submission' },
                      { col: 'hackathon_name', desc: 'Name of the hackathon' },
                      { col: 'team_name', desc: 'Team name' },
                      { col: 'participant_count', desc: 'Number of participants' },
                      { col: 'mentor_count', desc: 'Number of mentors' },
                      { col: 'participant_name', desc: 'Individual participant name' },
                      { col: 'participant_email', desc: 'College email address' },
                      { col: 'participant_department', desc: 'Department' },
                      { col: 'participant_year', desc: 'Academic year' },
                      { col: 'mentor_names', desc: 'Mentor names (semicolon-separated)' },
                      { col: 'mentor_departments', desc: 'Mentor departments (semicolon-separated)' },
                      { col: 'external_confirmed', desc: 'External registration confirmed' },
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-200">
                        <td className="px-3 py-2 font-mono text-gray-900">{item.col}</td>
                        <td className="px-3 py-2 text-gray-600">{item.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Recent Exports */}
        {submissions.length > 0 && (
          <div className="card p-6">
            <h3 className="heading-md mb-4">Sample Data</h3>
            <p className="text-sm text-gray-600 mb-4">
              Showing the first 3 submissions that will be included in exports
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">Hackathon</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">Team</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">Lead</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">Dept</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, 3).map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-200">
                      <td className="px-3 py-2 text-gray-900">{sub.hackathonName}</td>
                      <td className="px-3 py-2 text-gray-900">{sub.teamName}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {sub.participants[0]?.fullName || '-'}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {sub.participants[0]?.department || '-'}
                      </td>
                      <td className="px-3 py-2 text-gray-600">
                        {formatDate(sub.submittedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {submissions.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-gray-600">
              No submissions available for export yet. Students can submit their participation
              using the participation form.
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
