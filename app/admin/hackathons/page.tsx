'use client'

import AdminLayout from '@/components/AdminLayout'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate, slugify, generateId, cn } from '@/lib/utils'
import { useState } from 'react'
import { Hackathon, HackathonMode, HackathonStatus } from '@/lib/types'
import { Plus, Search, Edit2, Calendar, Globe, MapPin, ExternalLink, Info, CheckCircle2, Clock, XCircle, MoreVertical } from 'lucide-react'

export default function HackathonsPage() {
  const hackathons = useHackathonStore((state) => state.getAllHackathons())
  const addHackathon = useHackathonStore((state) => state.addHackathon)
  const updateHackathon = useHackathonStore((state) => state.updateHackathon)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
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

  const filteredHackathons = hackathons.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.organizer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusInfo = (status: HackathonStatus) => {
    switch (status) {
      case 'Active': return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' }
      case 'Upcoming': return { icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' }
      case 'Closed': return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
      case 'Completed': return { icon: CheckCircle2, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
      default: return { icon: Info, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500/20' }
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-2">
              Opportunities Management
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Configure and publish hackathons available to students
            </p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/5"
          >
            <Plus size={20} />
            Create Hackathon
          </button>
        </div>

        {/* Form Overlay */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
              <div className="p-8 md:p-10">
                <div className="flex justify-between items-center mb-10">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                    {editingId ? 'Edit Hackathon' : 'New Hackathon Entry'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
                  >
                    <XCircle size={24} className="text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Hackathon Name</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                        placeholder="e.g., Smart India Hackathon"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Organizer</label>
                      <input
                        type="text"
                        value={formData.organizer || ''}
                        onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                        placeholder="Organization Name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Mode</label>
                      <select
                        value={formData.mode || 'Hybrid'}
                        onChange={(e) => setFormData({ ...formData, mode: e.target.value as HackathonMode })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                      >
                        <option value="In-Person">In-Person</option>
                        <option value="Online">Online</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Location</label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                        placeholder="City, State"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Start Date</label>
                      <input
                        type="date"
                        value={formData.startDate || ''}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">End Date</label>
                      <input
                        type="date"
                        value={formData.endDate || ''}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Registration Deadline</label>
                      <input
                        type="date"
                        value={formData.registrationDeadline || ''}
                        onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Semester/Period</label>
                      <input
                        type="text"
                        value={formData.semester || ''}
                        onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                        placeholder="e.g., Odd Semester 2024"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Current Status</label>
                      <select
                        value={formData.status || 'Upcoming'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as HackathonStatus })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Closed">Closed</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Official Website Link</label>
                      <input
                        type="url"
                        value={formData.officialLink || ''}
                        onChange={(e) => setFormData({ ...formData, officialLink: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none"
                        placeholder="https://..."
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Main Description</label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none min-h-[120px]"
                      placeholder="Explain what this hackathon is about..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Eligibility Criteria</label>
                    <textarea
                      value={formData.eligibility || ''}
                      onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                      className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none min-h-[120px]"
                      placeholder="Who can participate? e.g., All departments, 3rd year only..."
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button type="submit" className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/10">
                      {editingId ? 'Update Record' : 'Publish Opportunity'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-8 py-4 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
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
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-coin-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or organizer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-4 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none shadow-sm"
          />
        </div>

        {/* Hackathons Grid */}
        <div className="grid grid-cols-1 gap-4">
          {filteredHackathons.length === 0 ? (
            <div className="p-20 text-center bg-white dark:bg-neutral-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <Info className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                No matching opportunities found.
              </p>
            </div>
          ) : (
            filteredHackathons.map((hackathon) => {
              const status = getStatusInfo(hackathon.status)
              return (
                <div
                  key={hackathon.id}
                  className="group bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl hover:shadow-xl hover:shadow-black/5 hover:border-coin-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading tracking-tight">
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

                    <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Globe size={14} className="opacity-70" />
                        <span className="font-medium">{hackathon.organizer}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="opacity-70" />
                        <span>{hackathon.location || hackathon.mode}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-coin-600 dark:text-coin-400">
                        <Calendar size={14} className="opacity-70" />
                        <span className="font-bold">Ends {formatDate(hackathon.registrationDeadline)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => handleOpenForm(hackathon)}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 font-bold rounded-xl hover:bg-coin-50 dark:hover:bg-coin-500/10 hover:text-coin-600 dark:hover:text-coin-400 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <a
                      href={hackathon.officialLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 text-slate-400 hover:text-coin-600 dark:hover:text-coin-400 hover:bg-slate-50 dark:hover:bg-white/5 rounded-xl transition-all"
                      title="Visit Website"
                    >
                      <ExternalLink size={20} />
                    </a>
                    <button className="p-2.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
                      <MoreVertical size={20} />
                    </button>
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
