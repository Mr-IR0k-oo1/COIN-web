'use client'

import AdminLayout from '@/components/AdminLayout'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate, slugify, generateId } from '@/lib/utils'
import { useState } from 'react'
import { Hackathon, HackathonMode, HackathonStatus } from '@/lib/types'

export default function HackathonsPage() {
  const hackathons = useHackathonStore((state) => state.getAllHackathons())
  const addHackathon = useHackathonStore((state) => state.addHackathon)
  const updateHackathon = useHackathonStore((state) => state.updateHackathon)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Hackathon>>({
    name: '',
    organizer: '',
    description: '',
    mode: 'Hybrid' as HackathonMode,
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    officialLink: '',
    eligibility: '',
    semester: '',
    status: 'Upcoming' as HackathonStatus,
  })

  const handleOpenForm = (hackathon?: Hackathon) => {
    if (hackathon) {
      setEditingId(hackathon.id)
      setFormData(hackathon)
    } else {
      setEditingId(null)
      setFormData({
        name: '',
        organizer: '',
        description: '',
        mode: 'Hybrid' as HackathonMode,
        location: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        officialLink: '',
        eligibility: '',
        semester: '',
        status: 'Upcoming' as HackathonStatus,
      })
    }
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      updateHackathon(editingId, {
        ...formData,
        updatedAt: new Date().toISOString(),
      })
    } else {
      const newHackathon: Hackathon = {
        id: generateId(),
        slug: slugify(formData.name || ''),
        name: formData.name || '',
        organizer: formData.organizer || '',
        description: formData.description || '',
        mode: formData.mode || 'Hybrid',
        location: formData.location,
        startDate: formData.startDate || '',
        endDate: formData.endDate || '',
        registrationDeadline: formData.registrationDeadline || '',
        officialLink: formData.officialLink || '',
        eligibility: formData.eligibility || '',
        semester: formData.semester || '',
        status: formData.status || 'Upcoming',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      addHackathon(newHackathon)
    }

    setShowForm(false)
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="section-heading mb-2">Hackathons</h1>
            <p className="text-gray-600">Manage published hackathons</p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="btn-primary"
          >
            + New Hackathon
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-8">
            <h2 className="heading-md mb-6">
              {editingId ? 'Edit Hackathon' : 'Create New Hackathon'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="label">Hackathon Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Organizer</label>
                  <input
                    type="text"
                    value={formData.organizer || ''}
                    onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Mode</label>
                  <select
                    value={formData.mode || 'Hybrid'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value as HackathonMode })}
                    className="select-field"
                  >
                    <option value="In-Person">In-Person</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="label">Location</label>
                  <input
                    type="text"
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="label">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Registration Deadline</label>
                  <input
                    type="date"
                    value={formData.registrationDeadline || ''}
                    onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Semester</label>
                  <input
                    type="text"
                    value={formData.semester || ''}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Spring 2024"
                    required
                  />
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    value={formData.status || 'Upcoming'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as HackathonStatus })}
                    className="select-field"
                  >
                    <option value="Active">Active</option>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Closed">Closed</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="label">Official Website</label>
                  <input
                    type="url"
                    value={formData.officialLink || ''}
                    onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field min-h-24"
                  required
                />
              </div>

              <div>
                <label className="label">Eligibility</label>
                <textarea
                  value={formData.eligibility || ''}
                  onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                  className="input-field min-h-24"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'} Hackathon
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Hackathons Table */}
        <div className="card overflow-hidden">
          {hackathons.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No hackathons published yet
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Name</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Organizer</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Mode</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Deadline</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hackathons.map((hackathon) => (
                  <tr key={hackathon.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-gray-900 font-medium text-sm">{hackathon.name}</td>
                    <td className="py-3 px-6 text-gray-600 text-sm">{hackathon.organizer}</td>
                    <td className="py-3 px-6 text-gray-600 text-sm">{hackathon.mode}</td>
                    <td className="py-3 px-6">
                      <span className={`badge ${
                        hackathon.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : hackathon.status === 'Upcoming'
                            ? 'bg-blue-100 text-blue-700'
                            : hackathon.status === 'Closed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                      }`}>
                        {hackathon.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-gray-600 text-sm">
                      {formatDate(hackathon.registrationDeadline)}
                    </td>
                    <td className="py-3 px-6">
                      <button
                        onClick={() => handleOpenForm(hackathon)}
                        className="text-coin-600 hover:text-coin-700 font-medium text-sm"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
