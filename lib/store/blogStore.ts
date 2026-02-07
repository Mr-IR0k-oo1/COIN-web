import { create } from 'zustand'
import { BlogPost, BlogCategory } from '../types'
import { backendService } from '../services/backend'

interface BlogStore {
  posts: BlogPost[]
  isLoading: boolean
  error: string | null
  fetchPosts: () => Promise<void>
  getPostBySlug: (slug: string) => Promise<BlogPost | undefined>
  getAllPosts: () => BlogPost[]
  getPublishedPosts: () => BlogPost[]
  getPostsByCategory: (category: BlogCategory) => BlogPost[]
  getLatestPosts: (count: number) => BlogPost[]
  addPost: (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'slug'>) => Promise<void>
  updatePost: (id: string, post: Partial<BlogPost>) => Promise<void>
  deletePost: (id: string) => Promise<void>
}

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,

  fetchPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      const posts = await backendService.getBlogPosts()
      set({ posts, isLoading: false })
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  getPostBySlug: async (slug: string) => {
    const existing = get().posts.find((p) => p.slug === slug)
    if (existing) return existing

    try {
      const post = await backendService.getBlogPostBySlug(slug)
      return post || undefined
    } catch (error) {
      return undefined
    }
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

  addPost: async (post) => {
    set({ isLoading: true, error: null })
    try {
      await backendService.createBlogPost(post)
      await get().fetchPosts() // Re-fetch to get mapped data
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  updatePost: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      await backendService.updateBlogPost(id, updates)
      await get().fetchPosts()
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },

  deletePost: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await backendService.deleteBlogPost(id)
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        isLoading: false,
      }))
    } catch (error: any) {
      set({ error: error.message, isLoading: false })
    }
  },
}))
