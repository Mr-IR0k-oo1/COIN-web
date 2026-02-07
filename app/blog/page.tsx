'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useBlogStore } from '@/lib/store/blogStore'
import { formatDate, cn } from '@/lib/utils'
import { BlogCategory } from '@/lib/types'
import Section from '@/components/ui/Section'
import { Badge } from '@/components/ui/badge'

const CATEGORIES: BlogCategory[] = ['Article', 'Winner', 'Announcement']

export default function BlogPage() {
  const fetchPosts = useBlogStore((state) => state.fetchPosts)
  const allPosts = useBlogStore((state) => state.getPublishedPosts())
  const isLoading = useBlogStore((state) => state.isLoading)
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | 'All'>('All')

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

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
        <Section className="bg-ash-50 dark:bg-ash-950 border-b border-ash-200 dark:border-ash-800 pt-32 pb-16">
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-ash-900 dark:text-white mb-6 uppercase tracking-tighter">
            CoIN <span className="text-gradient">Blog</span>
          </h1>
          <p className="text-lg text-ash-600 max-w-2xl">
            Success stories, announcements, and insights from the SREC innovation community.
          </p>
        </Section>

        <Section className="bg-white dark:bg-ash-950">
          {/* Filters */}
          <div className="mb-12 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={cn(
                "px-8 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95",
                selectedCategory === 'All'
                  ? "bg-ash-900 dark:bg-flame-600 text-white shadow-xl shadow-flame-900/20"
                  : "bg-white dark:bg-ash-900 text-ash-600 dark:text-ash-400 border border-ash-200 dark:border-ash-700 hover:border-flame-400 hover:text-flame-600"
              )}
            >
              All Posts
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-8 py-3 rounded-full font-bold transition-all duration-300 transform active:scale-95",
                  selectedCategory === cat
                    ? "bg-ash-900 dark:bg-flame-600 text-white shadow-xl shadow-flame-900/20"
                    : "bg-white dark:bg-ash-900 text-ash-600 dark:text-ash-400 border border-ash-200 dark:border-ash-700 hover:border-flame-400 hover:text-flame-600"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Posts */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flame-600"></div>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-24 bg-ash-50 dark:bg-ash-950 rounded-3xl border border-dashed border-ash-200 dark:border-ash-800">
              <p className="text-ash-900 font-medium mb-2">No posts found</p>
              <p className="text-ash-500">There are no posts in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sorted.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group premium-card flex flex-col h-full"
                >
                  <div className="premium-card-inner" />
                  <div className="relative z-10 p-10 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                      <Badge
                        className={cn(
                          "py-1.5 px-4 text-[10px] font-bold uppercase tracking-[0.2em] border shadow-sm",
                          post.category === 'Winner'
                            ? 'bg-flame-500/10 text-flame-600 border-flame-500/20'
                            : post.category === 'Announcement'
                              ? 'bg-ember-500/10 text-ember-600 border-ember-500/20'
                              : 'bg-ash-500/10 text-ash-600 border-ash-500/20'
                        )}
                      >
                        {post.category}
                      </Badge>
                      <span className="text-[10px] text-ash-400 font-bold uppercase tracking-widest">{formatDate(post.createdAt)}</span>
                    </div>

                    <h2 className="text-2xl font-bold font-fancy tracking-tight text-ash-900 dark:text-white mb-6 group-hover:text-gradient transition-all line-clamp-2 leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-ash-600 dark:text-ash-400 mb-8 line-clamp-3 leading-relaxed flex-1 text-lg">
                      {post.summary}
                    </p>

                    <div className="pt-8 border-t border-ash-100 dark:border-ash-800 mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold text-flame-600 dark:text-flame-400 group-hover:underline">LEARN MORE →</span>

                      {(post.relatedHackathon || post.tags.length > 0) && (
                        <div className="flex gap-2">
                          {post.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold bg-ash-100 dark:bg-ash-900 text-ash-500 uppercase tracking-widest px-3 py-1.5 rounded-lg border border-ash-200 dark:border-ash-800"
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
        </Section>
      </main>
      <Footer />
    </>
  )
}
