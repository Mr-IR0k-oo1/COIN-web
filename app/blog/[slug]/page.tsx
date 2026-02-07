'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useBlogStore } from '@/lib/store/blogStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { BlogPost, Hackathon } from '@/lib/types'

interface PageProps {
  params: {
    slug: string
  }
}

export default function BlogDetailPage({ params }: PageProps) {
  const router = useRouter()
  const getPostBySlug = useBlogStore((state) => state.getPostBySlug)
  const getHackathonById = useHackathonStore((state) => state.getHackathonById)

  const [post, setPost] = useState<BlogPost | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [relatedHackathon, setRelatedHackathon] = useState<Hackathon | undefined>(undefined)

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true)
      const data = await getPostBySlug(params.slug)
      if (data) {
        setPost(data)
        if (data.relatedHackathon) {
          const hackathon = await getHackathonById(data.relatedHackathon)
          setRelatedHackathon(hackathon)
        }
      }
      setLoading(false)
    }
    fetchPost()
  }, [params.slug, getPostBySlug, getHackathonById])

  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="py-24 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flame-600"></div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl font-bold mb-4">Transmission Not Found</h1>
              <p className="text-ash-600 mb-8">The broadcast signal for this channel has been terminated or relocated.</p>
              <Link href="/blog" className="px-8 py-3 bg-ash-900 text-white font-bold rounded-2xl">
                Return to Media Engine
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <article>
          <section className="pt-32 pb-16 bg-white dark:bg-ash-950 border-b border-ash-100 dark:border-ash-700">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => router.back()}
                className="text-flame-600 hover:text-flame-700 font-bold text-sm mb-8 block transition-colors"
              >
                ← Back to Feed
              </button>

              <div className="flex items-center gap-4 mb-6">
                <span
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${post.category === 'Winner'
                    ? 'bg-flame-500/10 text-flame-600 border-flame-500/20'
                    : post.category === 'Announcement'
                      ? 'bg-ember-500/10 text-ember-600 border-ember-500/20'
                      : 'bg-ember-500/10 text-ember-600 border-ember-500/20'
                    }`}
                >
                  {post.category}
                </span>
                <span className="text-xs font-bold text-ash-400 uppercase tracking-widest">{formatDate(post.createdAt)}</span>
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold text-ash-900 dark:text-white font-heading tracking-tight mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-xl text-ash-500 dark:text-ash-400 font-medium leading-relaxed italic border-l-4 border-flame-500 pl-6">
                {post.summary}
              </p>
            </div>
          </section>

          <section className="py-20 bg-ash-50 dark:bg-ash-900/50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white dark:bg-ash-900 p-10 md:p-16 rounded-[40px] border border-ash-200 dark:border-ash-800 shadow-sm">
                <div className="mb-12 pb-12 border-b border-ash-100 dark:border-ash-800 flex flex-wrap gap-8 items-start justify-between">
                  {relatedHackathon && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest">Linked Opportunity</p>
                      <Link
                        href={`/hackathons/${relatedHackathon.slug}`}
                        className="text-flame-600 hover:underline font-bold text-lg"
                      >
                        {relatedHackathon.name}
                      </Link>
                    </div>
                  )}

                  {post.tags.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-ash-400 uppercase tracking-widest">Metadata Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-ash-50 dark:bg-ash-900 text-ash-500 border border-ash-200 dark:border-ash-700 px-3 py-1 rounded-full text-xs font-bold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="prose prose-slate max-w-none dark:prose-invert">
                  {post.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="text-2xl font-bold font-heading mt-12 mb-6 dark:text-white">
                          {paragraph.slice(3)}
                        </h2>
                      )
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-3 text-ash-600 dark:text-ash-400 mb-8">
                          {paragraph.split('\n').map((line, lineIdx) => (
                            <li key={lineIdx} className="leading-relaxed">{line.slice(2)}</li>
                          ))}
                        </ul>
                      )
                    }
                    return (
                      <p key={idx} className="text-ash-700 dark:text-ash-300 mb-6 leading-relaxed text-lg">
                        {paragraph}
                      </p>
                    )
                  })}
                </div>
              </div>

              <div className="text-center mt-16">
                <Link href="/blog" className="inline-flex items-center gap-2 px-10 py-4 bg-ash-900 text-white font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all">
                  Browse More Transmissions
                </Link>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
