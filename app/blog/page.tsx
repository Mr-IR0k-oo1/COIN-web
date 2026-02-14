'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useBlogStore } from '@/lib/store/blogStore'
import { formatDate, cn } from '@/lib/utils'
import { BlogCategory } from '@/lib/types'
import Section from '@/components/ui/Section'
import { PageHero } from '@/components/ui/page-hero'


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
        <PageHero
          fullHeight={true}
          title={<>CoIN <span className="text-gradient">Updates</span></>}
          description="Success stories, announcements, and insights from the SREC innovation community."
          badge="Our Stories"
          align="center"
        />

        <Section fullHeight={true} variant="minimal" className="bg-white dark:bg-black">
          {/* Filters */}
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('All')}
              className={cn(
                "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border",
                selectedCategory === 'All'
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg transform scale-105"
                  : "bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              )}
            >
              All Posts
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all border",
                  selectedCategory === cat
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-lg transform scale-105"
                    : "bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:border-slate-400"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blog Posts */}
          {isLoading ? (
            <div className="flex items-center justify-center py-24">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-flame-600"></div>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-900 dark:text-white font-bold text-xl mb-2">No posts found</p>
              <p className="text-slate-500">There are no posts in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sorted.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group card-premium relative flex flex-col h-full bg-white dark:bg-neutral-900/30 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-6 opacity-50">
                    <span className={cn(
                      "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                      post.category === 'Winner' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                        post.category === 'Announcement' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' :
                          'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                    )}>
                      {post.category}
                    </span>
                  </div>

                  <div className="p-8 md:p-10 flex flex-col h-full">
                    <div className="mt-8 mb-4">
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest block mb-2">{formatDate(post.createdAt)}</span>
                      <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white group-hover:text-flame-500 transition-colors line-clamp-2 leading-tight">
                        {post.title}
                      </h2>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 mb-8 line-clamp-3 leading-relaxed flex-1 text-sm">
                      {post.summary}
                    </p>

                    <div className="pt-6 border-t border-slate-100 dark:border-white/5 mt-auto flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-widest text-slate-400 group-hover:text-flame-500 transition-colors">Read Article &rarr;</span>

                      {(post.relatedHackathon || post.tags.length > 0) && (
                        <div className="flex gap-2">
                          {post.tags.slice(0, 1).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 uppercase tracking-widest px-2 py-1 rounded border border-slate-200 dark:border-slate-700"
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
