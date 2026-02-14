'use client'

import { useState, useEffect } from 'react'
import { useStudentStore, StudentUser } from '@/lib/store/studentStore'
import { Search, Filter, User, GraduationCap, Code, Settings, LogOut } from 'lucide-react'
import Section from '@/components/ui/Section'
import Link from 'next/link'

export default function StudentDashboard() {
    const { logout, searchStudents } = useStudentStore()
    const [students, setStudents] = useState<StudentUser[]>([])
    const [filters, setFilters] = useState({
        year: '',
        branch: '',
        skills: ''
    })
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async () => {
        setIsSearching(true)
        const results = await searchStudents({
            year: filters.year ? Number(filters.year) : undefined,
            branch: filters.branch,
            skills: filters.skills
        })
        setStudents(results)
        setIsSearching(false)
    }

    useEffect(() => {
        handleSearch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div className="bg-white dark:bg-ash-950 min-h-screen pb-20">
            <Section fullHeight={true} className="pb-10">
                <div className="text-center md:text-left mb-12">
                    <h1 className="text-4xl md:text-6xl font-display font-black tracking-tighter text-ash-900 dark:text-white uppercase mb-4">
                        Find <span className="text-gradient">Teammates</span>
                    </h1>
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <p className="text-lg text-ash-500 dark:text-ash-400 max-w-2xl">
                            Connect with developers, designers, and innovators across SREC to collaborate on hackathons.
                        </p>
                        <div className="flex gap-3 md:ml-auto">
                            <Link
                                href="/student/profile"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-ash-100 dark:bg-ash-900 text-ash-700 dark:text-ash-300 rounded-xl text-sm font-bold hover:bg-ash-200 dark:hover:bg-ash-800 transition-all border border-transparent"
                            >
                                <Settings className="h-4 w-4" />
                                My Profile
                            </Link>
                            <button
                                onClick={() => logout()}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-ember-500/10 text-ember-500 rounded-xl text-sm font-bold hover:bg-ember-500/20 transition-all border border-ember-500/10"
                            >
                                <LogOut className="h-4 w-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="group card-premium p-8 mb-12">
                    <div className="premium-card-inner" />
                    <div className="relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-ash-400">Academic Year</label>
                                <select
                                    value={filters.year}
                                    onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                                    className="w-full px-4 py-3 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-flame-500/50"
                                >
                                    <option value="">All Years</option>
                                    <option value="1">1st Year</option>
                                    <option value="2">2nd Year</option>
                                    <option value="3">3rd Year</option>
                                    <option value="4">4th Year</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-ash-400">Department</label>
                                <input
                                    type="text"
                                    value={filters.branch}
                                    onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                                    placeholder="e.g. CSE"
                                    className="w-full px-4 py-3 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-flame-500/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-ash-400">Skills</label>
                                <input
                                    type="text"
                                    value={filters.skills}
                                    onChange={(e) => setFilters({ ...filters, skills: e.target.value })}
                                    placeholder="e.g. React"
                                    className="w-full px-4 py-3 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-flame-500/50"
                                />
                            </div>
                            <div className="md:pt-6">
                                <button
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                    className="w-full h-[3.25rem] bg-flame-600 hover:bg-flame-500 text-white font-bold rounded-xl shadow-lg shadow-flame-600/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {isSearching ? <span className="animate-spin text-xl">◌</span> : <Search className="h-5 w-5" />}
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student Grid */}
                {students.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {students.map((student) => (
                            <div key={student.id} className="group card-premium p-8 flex flex-col h-full">
                                <div className="premium-card-inner" />
                                <div className="relative z-10 flex-1">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="h-14 w-14 bg-gradient-to-br from-ash-100 to-ash-200 dark:from-white/10 dark:to-white/5 rounded-2xl flex items-center justify-center text-ash-600 dark:text-ash-400 group-hover:from-flame-600 group-hover:to-flame-400 group-hover:text-white transition-all duration-500">
                                            <User className="h-7 w-7" />
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-flame-600 dark:text-flame-400 bg-flame-600/10 px-3 py-1 rounded-full border border-flame-600/20">
                                            {student.branch}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold text-ash-900 dark:text-white mb-2 font-fancy tracking-tight">
                                        {student.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-ash-500 dark:text-ash-400 mb-6 font-medium text-sm">
                                        <GraduationCap className="h-4 w-4" />
                                        {student.year === 1 ? '1st' : student.year === 2 ? '2nd' : student.year === 3 ? '3rd' : '4th'} Year Student
                                    </div>

                                    {student.bio && (
                                        <p className="text-ash-600 dark:text-ash-400 text-sm italic leading-relaxed mb-6 line-clamp-2">
                                            "{student.bio}"
                                        </p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {student.skills?.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-ash-100 dark:bg-white/10 text-ash-600 dark:text-ash-300 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative z-10 mt-auto">
                                    <a
                                        href={`mailto:${student.email}`}
                                        className="inline-flex items-center justify-center w-full px-6 py-4 bg-white dark:bg-ash-900 border border-ash-200 dark:border-ash-700 text-ash-900 dark:text-white font-bold rounded-2xl hover:bg-flame-600 hover:border-flame-600 hover:text-white transition-all duration-300"
                                    >
                                        Contact Colleague
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-ash-100 dark:bg-ash-900 text-ash-400 mb-6">
                            <Search className="h-10 w-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-ash-900 dark:text-white mb-2">No students found</h3>
                        <p className="text-ash-500">Try adjusting your search filters to find more teammates.</p>
                    </div>
                )}
            </Section>
        </div>
    )
}
