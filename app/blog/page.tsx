'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useBlogStore } from '@/lib/store/blogStore'
import { formatDate, cn } from '@/lib/utils'
import { useState } from 'react'
import { BlogCategory } from '@/lib/types'
import Section from '@/components/ui/Section'
import { Badge } from '@/components/ui/badge'

const CATEGORIES: BlogCategory[] = ['Article', 'Winner', 'Announcement']

export default function BlogPage() {
  const allPosts = useBlogStore((state) => state.getPublishedPosts())
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All')

  const filtered =
    selectedCategory === 'All'
      ? allPosts
      : allPosts.filter((p) => p.category === selectedCategory)

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <>
      <Header />
      <main className="flex-1">
        <Section className="bg-slate-50 dark:bg-black border-b border-slate-200 dark:border-slate-800 pt-32 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-display font-extrabold text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">
              CoIN <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Success stories, announcements, and insights from the SREC innovation community.
            </p>
          </div>
        </Section>

        <Section className="bg-white dark:bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filters */}
            <div className="mb-10 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('All')}
                className={cn(
                  "px-5 py-2.5 rounded-full font-medium transition-all duration-200",
                  selectedCategory === 'All'
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                )}
              >
                All Posts
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-5 py-2.5 rounded-full font-medium transition-all duration-200",
                    selectedCategory === cat
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                      : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-100"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Blog Posts */}
            {sorted.length === 0 ? (
              <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                <p className="text-slate-900 font-medium mb-2">No posts found</p>
                <p className="text-slate-500">There are no posts in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sorted.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group bg-white dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-coin-900/5 hover:border-coin-200 transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="p-8 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-6">
                        <Badge
                          variant="outline"
                          className={cn(
                            "py-1",
                            post.category === 'Winner'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : post.category === 'Announcement'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-50 text-slate-700 border-slate-200'
                          )}
                        >
                          {post.category}
                        </Badge>
                        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{formatDate(post.createdAt)}</span>
                      </div>

                      <h2 className="text-2xl font-bold font-fancy tracking-tight text-slate-900 dark:text-white mb-4 group-hover:text-coin-600 dark:group-hover:text-coin-400 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>

                      <p className="text-slate-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                        {post.summary}
                      </p>

                      <div className="pt-6 border-t border-slate-100 mt-auto flex items-center justify-between">
                        <span className="text-sm font-bold text-coin-600 group-hover:underline">Read Article</span>

                        {(post.relatedHackathon || post.tags.length > 0) && (
                          <div className="flex gap-2">
                            {post.tags.slice(0, 1).map((tag) => (
                              <span
                                key={tag}
                                className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Section>
      </main>
      <Footer />
    </>
  )
}
