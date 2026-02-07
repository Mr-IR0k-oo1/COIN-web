'use client'

import { useState, useEffect } from 'react'
import { useStudentStore } from '@/lib/store/studentStore'
import { User, GraduationCap, BookOpen, MessageSquare, Plus, X, Check, Loader2 } from 'lucide-react'
import Section from '@/components/ui/Section'

export default function StudentProfilePage() {
    const { user, updateProfile, loading } = useStudentStore()
    const [formData, setFormData] = useState({
        name: user?.name || '',
        year: user?.year || 1,
        branch: user?.branch || '',
        bio: user?.bio || '',
    })
    const [skills, setSkills] = useState<string[]>(user?.skills || [])
    const [skillInput, setSkillInput] = useState('')
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null)

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                year: user.year,
                branch: user.branch,
                bio: user.bio || '',
            })
            setSkills(user.skills || [])
        }
    }, [user])

    const handleAddSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()])
            setSkillInput('')
        }
    }

    const handleRemoveSkill = (skill: string) => {
        setSkills(skills.filter(s => s !== skill))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus(null)

        const success = await updateProfile({ ...formData, skills })
        if (success) {
            setStatus({ type: 'success', msg: 'Profile updated successfully!' })
            setTimeout(() => setStatus(null), 3000)
        } else {
            setStatus({ type: 'error', msg: 'Failed to update profile.' })
        }
    }

    if (!user) return null

    return (
        <div className="bg-white dark:bg-ash-950 min-h-screen pb-20">
            <Section className="pb-10">
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-ash-900 dark:text-white uppercase mb-4">
                        Your <span className="text-gradient">Profile</span>
                    </h1>
                    <p className="text-lg text-ash-500 dark:text-ash-400">
                        Customize how other students see your skills and interests.
                    </p>
                </div>

                {status && (
                    <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 border ${status.type === 'success'
                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                        : 'bg-ember-500/10 border-ember-500/20 text-ember-500'
                        }`}>
                        {status.type === 'success' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                        <span className="font-bold text-sm tracking-tight">{status.msg}</span>
                    </div>
                )}

                <div className="group premium-card p-10">
                    <div className="premium-card-inner" />

                    <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-400 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-400 ml-1">Academic Year</label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <select
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all appearance-none font-medium"
                                    >
                                        <option value={1}>1st Year</option>
                                        <option value={2}>2nd Year</option>
                                        <option value={3}>3rd Year</option>
                                        <option value={4}>4th Year</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-400 ml-1">Department / Branch</label>
                                <div className="relative">
                                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                    <input
                                        type="text"
                                        value={formData.branch}
                                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-400 ml-1">Short Bio</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-4 top-6 h-5 w-5 text-ash-400" />
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={4}
                                        placeholder="Tell potential teammates about your interests..."
                                        className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all resize-none font-medium"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 col-span-1 md:col-span-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-ash-400 ml-1">Technical Skills</label>
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <Plus className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ash-400" />
                                        <input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                            placeholder="Add a skill (e.g. React)"
                                            className="w-full pl-12 pr-4 py-4 bg-ash-50 dark:bg-ash-900 border border-ash-200 dark:border-ash-700 rounded-2xl text-ash-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-flame-500/50 transition-all font-medium"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleAddSkill}
                                        className="px-8 bg-ash-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:bg-flame-600 dark:hover:bg-flame-500 hover:text-white transition-all shadow-lg"
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-3 mt-4">
                                    {skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="group/skill flex items-center gap-2 px-4 py-2 bg-ash-100 dark:bg-white/10 text-ash-700 dark:text-ash-200 rounded-xl text-sm font-bold border border-transparent hover:border-flame-500/30 transition-all"
                                        >
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkill(skill)}
                                                className="text-ash-400 group-hover/skill:text-flame-500 transition-colors"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-gradient-to-r from-flame-600 to-flame-400 text-white font-black rounded-2xl shadow-xl shadow-flame-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed uppercase tracking-wider"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Save Profile Changes
                                        <Check className="h-5 w-5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Section>
        </div>
    )
}
