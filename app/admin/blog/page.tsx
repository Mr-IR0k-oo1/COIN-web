'use client'

import AdminLayout from '@/components/AdminLayout'
import { useBlogStore } from '@/lib/store/blogStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate, slugify, generateId, cn } from '@/lib/utils'
import { useState } from 'react'
import { BlogPost, BlogCategory } from '@/lib/types'
import { Plus, Search, Edit2, Trash2, Layout, Tag, Send, FileText, XCircle, Info, MoreHorizontal, CheckCircle2, LayoutList, Clock } from 'lucide-react'

const CATEGORIES: BlogCategory[] = ['Article', 'Winner', 'Announcement']

export default function BlogManagementPage() {
  const posts = useBlogStore((state) => state.getAllPosts())
  const hackathons = useHackathonStore((state) => state.getAllHackathons())
  const addPost = useBlogStore((state) => state.addPost)
  const updatePost = useBlogStore((state) => state.updatePost)
  const deletePost = useBlogStore((state) => state.deletePost)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    summary: '',
    content: '',
    category: 'Article' as BlogCategory,
    tags: [],
    relatedHackathon: undefined,
    status: 'Draft',
  })
  const [tagInput, setTagInput] = useState('')

  const handleOpenForm = (post?: BlogPost) => {
    if (post) {
      setEditingId(post.id)
      setFormData(post)
      setTagInput(post.tags.join(', '))
    } else {
      setEditingId(null)
      setFormData({
        title: '',
        summary: '',
        content: '',
        category: 'Article' as BlogCategory,
        tags: [],
        relatedHackathon: undefined,
        status: 'Draft',
      })
      setTagInput('')
    }
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    if (editingId) {
      updatePost(editingId, {
        ...formData,
        tags,
        updatedAt: new Date().toISOString(),
      })
    } else {
      const newPost: BlogPost = {
        id: generateId(),
        slug: slugify(formData.title || ''),
        title: formData.title || '',
        summary: formData.summary || '',
        content: formData.content || '',
        category: formData.category || 'Article',
        tags,
        relatedHackathon: formData.relatedHackathon,
        status: formData.status || 'Draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      addPost(newPost)
    }

    setShowForm(false)
  }

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getCategoryStyles = (category: BlogCategory) => {
    switch (category) {
      case 'Winner': return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20'
      case 'Announcement': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
      default: return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight mb-2">
              Media Engine
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Broadcast updates, celebrate winners, and share insights
            </p>
          </div>
          <button
            onClick={() => handleOpenForm()}
            className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-black/5"
          >
            <Plus size={20} />
            Write Post
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-neutral-900 w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-coin-500/10 flex items-center justify-center text-coin-600">
                      <Layout size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">
                        {editingId ? 'Refine Post' : 'Compose Broadcast'}
                      </h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {editingId ? 'Updating active transmission' : 'Preparing new broadcast channel'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors"
                  >
                    <XCircle size={24} className="text-slate-400" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left: Metadata */}
                    <div className="lg:col-span-1 space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Context Category</label>
                        <div className="grid grid-cols-1 gap-2">
                          {CATEGORIES.map((cat) => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setFormData({ ...formData, category: cat })}
                              className={cn(
                                "text-left px-5 py-3 rounded-xl border-2 transition-all font-bold text-sm",
                                formData.category === cat
                                  ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-black shadow-lg"
                                  : "bg-white dark:bg-black/20 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200"
                              )}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Transmission State</label>
                        <select
                          value={formData.status || 'Draft'}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                          className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-coin-500/20 focus:border-coin-500 transition-all outline-none font-bold text-sm"
                        >
                          <option value="Draft">Draft (Offline)</option>
                          <option value="Published">Published (Live)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <Tag size={12} /> Tags
                        </label>
                        <input
                          type="text"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="innovation, SIH2024..."
                          className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Related Opportunity</label>
                        <select
                          value={formData.relatedHackathon || ''}
                          onChange={(e) => setFormData({ ...formData, relatedHackathon: e.target.value || undefined })}
                          className="w-full px-5 py-3 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm"
                        >
                          <option value="">Independent Link</option>
                          {hackathons.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:col-span-2 space-y-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Broadcast Title</label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full px-0 bg-transparent border-b-2 border-slate-100 dark:border-slate-800 focus:border-coin-500 outline-none text-3xl font-bold dark:text-white transition-all py-2"
                          placeholder="The Headline Goes Here"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Brief Abstract</label>
                        <textarea
                          value={formData.summary || ''}
                          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-slate-600 dark:text-slate-400 min-h-[80px]"
                          placeholder="Summarize the core message in one or two punchy sentences..."
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Main Narrative (Markdown)</label>
                        <textarea
                          value={formData.content || ''}
                          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                          className="w-full px-5 py-4 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-slate-700 dark:text-slate-300 min-h-[300px] font-mono text-sm leading-relaxed"
                          placeholder="## Deep Dive&#10;&#10;Use standard markdown for formatting.&#10;- Points matter&#10;- Subheadings guide readers"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-10 border-t border-slate-100 dark:border-slate-800">
                    <button type="submit" className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3">
                      <Send size={20} />
                      {editingId ? 'Propagate Updates' : 'Launch Broadcast'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-10 py-5 bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                    >
                      Abort
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Search Feed */}
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-coin-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search transmission logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-8 py-5 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 rounded-3xl outline-none text-lg shadow-sm focus:ring-4 focus:ring-coin-500/10 transition-all"
          />
        </div>

        {/* Posts Inventory */}
        <div className="grid grid-cols-1 gap-4">
          {filteredPosts.length === 0 ? (
            <div className="p-32 text-center bg-white dark:bg-neutral-900 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-800">
              <FileText className="mx-auto text-slate-200 dark:text-slate-800 mb-6" size={64} />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xl">The airwaves are silent.</p>
              <p className="text-slate-400 text-sm mt-2">No transmissions found matching your filter.</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="group bg-white dark:bg-neutral-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[32px] hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] border",
                        getCategoryStyles(post.category)
                      )}>
                        {post.category}
                      </span>
                      <span className={cn(
                        "px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-1.5",
                        post.status === 'Published'
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : "bg-slate-100 text-slate-500 border-slate-200 dark:bg-white/5 dark:border-white/10"
                      )}>
                        {post.status === 'Published' ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {post.status}
                      </span>
                      <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {formatDate(post.createdAt)}
                      </time>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading leading-tight group-hover:text-coin-600 transition-colors">
                      {post.title}
                    </h3>

                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed">
                      {post.summary}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-slate-50 dark:bg-white/5 text-slate-400 px-2 py-1 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center justify-center gap-3">
                    <button
                      onClick={() => handleOpenForm(post)}
                      className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-coin-500 hover:text-white dark:hover:bg-coin-500 dark:hover:text-white transition-all flex items-center justify-center shadow-sm"
                      title="Edit Post"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                      title="Delete Post"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
