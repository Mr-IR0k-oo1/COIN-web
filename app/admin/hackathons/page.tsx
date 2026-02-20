'use client'

import AdminLayout from '@/components/AdminLayout'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate, cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Hackathon, HackathonMode, HackathonStatus } from '@/lib/types'
import { Plus, Search, Edit2, Calendar, Globe, MapPin, ExternalLink, Info, CheckCircle2, Clock, XCircle, MoreVertical, Trash2 } from 'lucide-react'

export default function HackathonsPage() {
  const hackathons = useHackathonStore((state) => state.hackathons)
  const fetchHackathons = useHackathonStore((state) => state.fetchHackathons)
  const isLoading = useHackathonStore((state) => state.isLoading)
  const addHackathon = useHackathonStore((state) => state.addHackathon)
  const updateHackathon = useHackathonStore((state) => state.updateHackathon)
  const deleteHackathon = useHackathonStore((state) => state.deleteHackathon)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState<Partial<Hackathon>>({
    name: '',
    organizer: '',
    description: '',
    mode: 'ONLINE' as HackathonMode,
    location: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    officialRegistrationLink: '',
    eligibility: '',
    semester: '',
    status: 'UPCOMING' as HackathonStatus,
  })

  useEffect(() => {
    fetchHackathons()
  }, [fetchHackathons])

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
        mode: 'ONLINE' as HackathonMode,
        location: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        officialRegistrationLink: '',
        eligibility: '',
        semester: '',
        status: 'UPCOMING' as HackathonStatus,
      })
    }
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      name: formData.name || '',
      organizer: formData.organizer || '',
      description: formData.description || '',
      mode: (formData.mode || 'ONLINE') as HackathonMode,
      location: formData.location || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      registrationDeadline: formData.registrationDeadline || '',
      officialRegistrationLink: formData.officialRegistrationLink || '',
      eligibility: formData.eligibility || '',
      semester: formData.semester || '',
      status: (formData.status || 'UPCOMING') as HackathonStatus,
    }

    if (editingId) {
      await updateHackathon(editingId, payload)
    } else {
      await addHackathon(payload)
    }

    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hackathon?')) {
      await deleteHackathon(id)
    }
  }

  const filteredHackathons = hackathons.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusInfo = (status: HackathonStatus) => {
    switch (status) {
      case 'ONGOING': return { icon: CheckCircle2, color: 'text-flame-500', bg: 'bg-flame-500/10', border: 'border-flame-500/20' }
      case 'UPCOMING': return { icon: Clock, color: 'text-ember-500', bg: 'bg-ember-500/10', border: 'border-ember-500/20' }
      case 'CLOSED': return { icon: XCircle, color: 'text-ash-500', bg: 'bg-ash-500/10', border: 'border-ash-500/20' }
      default: return { icon: Info, color: 'text-ash-500', bg: 'bg-ash-500/10', border: 'border-ash-500/20' }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ash-900 dark:text-white font-heading tracking-tight mb-2">
              Opportunities Management
            </h1>
            <p className="text-ash-500 dark:text-ash-400">
              Configure and publish hackathons available to students
            </p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="px-6 py-2.5 bg-ash-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/5"
          >
            <Plus size={20} />
            Create Hackathon
          </button>
        </div>

        {/* Form Overlay */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-ash-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-ash-200 dark:border-ash-800 animate-in zoom-in-95 duration-300">
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold text-ash-900 dark:text-white font-heading">
                    {editingId ? 'Edit Hackathon' : 'New Hackathon Entry'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-ash-100 dark:hover:bg-white/5 rounded-full transition-colors"
                  >
                    <XCircle size={24} className="text-ash-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Hackathon Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                        placeholder="e.g., Smart India Hackathon"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Organizer</label>
                      <input
                        type="text"
                        value={formData.organizer || ''}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                        placeholder="Organization Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Mode</label>
                      <select
                        value={formData.mode || 'Hybrid'}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value as HackathonMode })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                      >
                        <option value="In-Person">In-Person</option>
                        <option value="Online">Online</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Location</label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                        placeholder="City, State"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate ? formData.startDate.split('T')[0] : ''}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate ? formData.endDate.split('T')[0] : ''}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Registration Deadline</label>
                      <input
                        type="date"
                        value={formData.registrationDeadline ? formData.registrationDeadline.split('T')[0] : ''}
                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Semester/Period</label>
                      <input
                        type="text"
                        value={formData.semester || ''}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                        placeholder="e.g., Odd Semester 2024"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Current Status</label>
                      <select
                        value={formData.status || 'UPCOMING'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as HackathonStatus })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                      >
                        <option value="ONGOING">Active</option>
                        <option value="UPCOMING">Upcoming</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Official Website Link</label>
                      <input
                        type="url"
                        value={formData.officialRegistrationLink || ''}
                        onChange={(e) => setFormData({ ...formData, officialRegistrationLink: e.target.value })}
                        className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none"
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Main Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none min-h-[120px]"
                      placeholder="Explain what this hackathon is about..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-ash-700 dark:text-ash-300 ml-1">Eligibility Criteria</label>
                    <textarea
                      value={formData.eligibility || ''}
                      onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                      className="w-full px-5 py-3 bg-ash-50 dark:bg-ash-900/60 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none min-h-[120px]"
                      placeholder="Who can participate? e.g., All departments, 3rd year only..."
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 bg-ash-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/10">
                      {editingId ? 'Update Record' : 'Publish Opportunity'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-8 py-4 bg-ash-100 dark:bg-ash-900 text-ash-600 dark:text-ash-400 font-bold rounded-2xl hover:bg-ash-200 dark:hover:bg-ash-800 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-ash-400 group-focus-within:text-flame-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 rounded-2xl focus:ring-2 focus:ring-flame-500/20 focus:border-flame-500 transition-all outline-none shadow-sm"
          />
        </div>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flame-600"></div>
            </div>
          ) : filteredHackathons.length === 0 ? (
            <div className="p-20 text-center bg-white dark:bg-ash-900 border border-dashed border-ash-200 dark:border-ash-800 rounded-3xl">
              <Info className="mx-auto text-ash-300 dark:text-ash-700 mb-4" size={48} />
              <p className="text-ash-500 dark:text-ash-400 font-medium">
                No matching opportunities found.
              </p>
            </div>
          ) : (
            filteredHackathons.map((hackathon) => {
              const status = getStatusInfo(hackathon.status)
              return (
                <div
                  key={hackathon.id}
                  className="group bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-800 p-6 rounded-3xl hover:shadow-xl hover:shadow-black/5 hover:border-flame-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-ash-900 dark:text-white font-heading tracking-tight">
                        {hackathon.name}
                      </h3>
                      <div className={cn(
                        "flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                        status.bg, status.color, status.border
                      )}>
                        <status.icon size={12} />
                        {hackathon.status}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-ash-500 dark:text-ash-400">
                      <div className="flex items-center gap-1.5">
                        <Globe size={14} className="opacity-70" />
                        <span className="font-medium">{hackathon.organizer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="opacity-70" />
                        <span>{hackathon.location || hackathon.mode}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-flame-600 dark:text-flame-400">
                        <Calendar size={14} className="opacity-70" />
                        <span className="font-bold">Ends {formatDate(hackathon.registrationDeadline)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleOpenForm(hackathon)}
                      className="px-5 py-2.5 bg-ash-50 dark:bg-ash-900 text-ash-700 dark:text-ash-300 font-bold rounded-xl hover:bg-flame-50 dark:hover:bg-flame-500/10 hover:text-flame-600 dark:hover:text-flame-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(hackathon.id)}
                      className="p-2.5 text-ash-400 hover:text-ember-500 dark:hover:text-ember-400 hover:bg-ember-50 dark:hover:bg-ember-500/10 rounded-xl transition-all"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                    <a
                      href={hackathon.officialRegistrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-ash-400 hover:text-flame-600 dark:hover:text-flame-400 hover:bg-ash-50 dark:hover:bg-white/5 rounded-xl transition-all"
                      title="Visit Website"
                    >
                      <ExternalLink size={20} />
                    </a>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
