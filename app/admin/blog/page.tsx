'use client'

import AdminLayout from '@/components/AdminLayout'
import { useBlogStore } from '@/lib/store/blogStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate, slugify, generateId } from '@/lib/utils'
import { useState } from 'react'
import { BlogPost, BlogCategory } from '@/lib/types'

const CATEGORIES: BlogCategory[] = ['Article', 'Winner', 'Announcement']

export default function BlogPage() {
  const posts = useBlogStore((state) => state.getAllPosts())
  const hackathons = useHackathonStore((state) => state.getAllHackathons())
  const addPost = useBlogStore((state) => state.addPost)
  const updatePost = useBlogStore((state) => state.updatePost)
  const deletePost = useBlogStore((state) => state.deletePost)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="section-heading mb-2">Blog</h1>
            <p className="text-gray-600">Create and manage CoIN blog posts</p>
          </div>
          <button onClick={() => handleOpenForm()} className="btn-primary">
            + New Post
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="card p-8">
            <h2 className="heading-md mb-6">
              {editingId ? 'Edit Post' : 'Create New Post'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="label">Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="label">Category</label>
                  <select
                    value={formData.category || 'Article'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as BlogCategory })}
                    className="select-field"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Status</label>
                  <select
                    value={formData.status || 'Draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="select-field"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Summary</label>
                  <textarea
                    value={formData.summary || ''}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="input-field min-h-20"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Content</label>
                  <textarea
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="input-field min-h-48"
                    placeholder="Use markdown. ## for headings, - for lists"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="e.g., Innovation, IoT, 2024"
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="label">Related Hackathon (optional)</label>
                  <select
                    value={formData.relatedHackathon || ''}
                    onChange={(e) => setFormData({ ...formData, relatedHackathon: e.target.value || undefined })}
                    className="select-field"
                  >
                    <option value="">None</option>
                    {hackathons.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <button type="submit" className="btn-primary">
                  {editingId ? 'Update' : 'Create'} Post
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

        {/* Posts List */}
        <div className="card overflow-hidden">
          {posts.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No blog posts created yet
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Title</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Category</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Created</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-gray-900 font-medium text-sm">{post.title}</td>
                    <td className="py-3 px-6">
                      <span className={`badge ${
                        post.category === 'Winner'
                          ? 'bg-green-100 text-green-700'
                          : post.category === 'Announcement'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                      }`}>
                        {post.category}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className={`badge ${
                        post.status === 'Published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-gray-600 text-sm">
                      {formatDate(post.createdAt)}
                    </td>
                    <td className="py-3 px-6 flex gap-3">
                      <button
                        onClick={() => handleOpenForm(post)}
                        className="text-coin-600 hover:text-coin-700 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Delete
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
