import { create } from 'zustand'
import { BlogPost, BlogCategory } from '../types'

const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    slug: 'iot-winners-2024',
    title: 'IoT Innovate 2024 Winners Announced',
    summary: 'Meet the winning teams from our flagship IoT hackathon. Innovative projects showcased.',
    content: `We are thrilled to announce the winners of IoT Innovate 2024. This year's event saw exceptional participation with 45 teams competing across multiple tracks.

## Grand Prize Winners

Team "Neural Networks" developed an intelligent home automation system using machine learning. Their solution impressed judges with scalability and practical application.

## Runner-up

Team "Smart City" created a comprehensive IoT solution for urban waste management, integrating sensors and cloud analytics.

## Best Innovation

"Connected Health" built a wearable monitoring system for elderly care, demonstrating strong social impact.

All winners will receive mentorship opportunities and potential internship placements.`,
    category: 'Winner' as BlogCategory,
    tags: ['IoT', 'Innovation', '2024', 'Winners'],
    relatedHackathon: '1',
    status: 'Published',
    createdAt: '2024-03-18',
    updatedAt: '2024-03-18',
  },
  {
    id: '2',
    slug: 'code-sprint-recap',
    title: 'Code Sprint 2024: A Successful Event',
    summary: 'Recap of the intense 48-hour programming competition. 120+ participants, amazing solutions.',
    content: `Code Sprint 2024 was a resounding success, drawing 120+ participants from across SREC and partner institutions.

## Highlights

- 24 competing teams
- 48-hour continuous programming challenge
- Problems spanning algorithms, system design, and optimization
- Top solutions achieved impressive time complexity improvements

## Winning Solutions

The top 3 teams solved the final problem in record time, demonstrating exceptional problem-solving skills.

We thank all participants and look forward to Code Sprint 2025!`,
    category: 'Article' as BlogCategory,
    tags: ['Programming', 'Competition', 'Results'],
    status: 'Published',
    createdAt: '2024-02-22',
    updatedAt: '2024-02-22',
  },
  {
    id: '3',
    slug: 'srec-innovation-roadmap-2024',
    title: 'SREC Innovation Roadmap 2024',
    summary: 'Announcing SREC\'s comprehensive innovation initiatives for 2024.',
    content: `SREC is committed to fostering a culture of innovation and entrepreneurship. This year, we are launching several new initiatives:

## New Programs

1. **Innovation Lab**: Dedicated space for student projects
2. **Mentorship Network**: Connect students with industry experts
3. **Funding Opportunities**: Grants for promising projects
4. **Industry Partnerships**: Collaboration with leading tech companies

## Timeline

- Q1 2024: Program launch
- Q2 2024: First cohort onboarding
- Q3 2024: Mid-year evaluations
- Q4 2024: Annual showcase

We invite all students to participate in this exciting journey!`,
    category: 'Announcement' as BlogCategory,
    tags: ['Innovation', 'Announcement', 'SREC'],
    status: 'Published',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
]

interface BlogStore {
  posts: BlogPost[]
  getPostBySlug: (slug: string) => BlogPost | undefined
  getAllPosts: () => BlogPost[]
  getPublishedPosts: () => BlogPost[]
  getPostsByCategory: (category: BlogCategory) => BlogPost[]
  getLatestPosts: (count: number) => BlogPost[]
  addPost: (post: BlogPost) => void
  updatePost: (id: string, post: Partial<BlogPost>) => void
  deletePost: (id: string) => void
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: MOCK_BLOG_POSTS,

  getPostBySlug: (slug: string) => {
    return get().posts.find((p) => p.slug === slug)
  },

  getAllPosts: () => {
    return get().posts
  },

  getPublishedPosts: () => {
    return get().posts.filter((p) => p.status === 'Published')
  },

  getPostsByCategory: (category: BlogCategory) => {
    return get().posts.filter(
      (p) => p.category === category && p.status === 'Published'
    )
  },

  getLatestPosts: (count: number) => {
    return get()
      .getPublishedPosts()
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, count)
  },

  addPost: (post: BlogPost) => {
    set((state) => ({
      posts: [...state.posts, post],
    }))
  },

  updatePost: (id: string, updates: Partial<BlogPost>) => {
    set((state) => ({
      posts: state.posts.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    }))
  },

  deletePost: (id: string) => {
    set((state) => ({
      posts: state.posts.filter((p) => p.id !== id),
    }))
  },
}))
