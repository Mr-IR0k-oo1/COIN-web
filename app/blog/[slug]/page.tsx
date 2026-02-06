'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { useBlogStore } from '@/lib/store/blogStore'
import { useHackathonStore } from '@/lib/store/hackathonStore'
import { formatDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: {
    slug: string
  }
}

export default function BlogDetailPage({ params }: PageProps) {
  const router = useRouter()
  const post = useBlogStore((state) => state.getPostBySlug(params.slug))
  const getHackathonById = useHackathonStore((state) => state.getHackathonById)

  if (!post) {
    return (
      <>
        <Header />
        <main className="flex-1">
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="section-heading mb-4">Article Not Found</h1>
              <p className="text-gray-600 mb-8">The article you are looking for does not exist.</p>
              <Link href="/blog" className="btn-primary">
                Back to Blog
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    )
  }

  const relatedHackathon = post.relatedHackathon ? getHackathonById(post.relatedHackathon) : null

  return (
    <>
      <Header />
      <main className="flex-1">
        <article>
          {/* Header */}
          <section className="py-12 bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <button
                onClick={() => router.back()}
                className="text-coin-600 hover:text-coin-700 font-medium text-sm mb-6"
              >
                ← Back
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`badge ${
                    post.category === 'Winner'
                      ? 'bg-green-100 text-green-700'
                      : post.category === 'Announcement'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {post.category}
                </span>
                <span className="text-gray-500">{formatDate(post.createdAt)}</span>
              </div>

              <h1 className="section-heading mb-4">{post.title}</h1>
              <p className="text-xl text-gray-600">{post.summary}</p>
            </div>
          </section>

          {/* Content */}
          <section className="py-12 bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="card p-8">
                {/* Meta Info */}
                <div className="mb-8 pb-8 border-b border-gray-200">
                  {relatedHackathon && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Related Hackathon</strong>
                      </p>
                      <Link
                        href={`/hackathons/${relatedHackathon.slug}`}
                        className="text-coin-600 hover:text-coin-700 font-medium"
                      >
                        {relatedHackathon.name}
                      </Link>
                    </div>
                  )}

                  {post.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Tags</strong>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-coin-50 text-coin-700 px-3 py-1 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="prose prose-sm max-w-none">
                  {post.content.split('\n\n').map((paragraph, idx) => {
                    if (paragraph.startsWith('## ')) {
                      return (
                        <h2 key={idx} className="heading-md mt-8 mb-4">
                          {paragraph.slice(3)}
                        </h2>
                      )
                    }
                    if (paragraph.startsWith('- ')) {
                      return (
                        <ul key={idx} className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                          {paragraph.split('\n').map((line, lineIdx) => (
                            <li key={lineIdx}>{line.slice(2)}</li>
                          ))}
                        </ul>
                      )
                    }
                    return (
                      <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  })}
                </div>
              </div>

              <div className="text-center mt-12">
                <Link href="/blog" className="btn-outline">
                  Read More Articles
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
