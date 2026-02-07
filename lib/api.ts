const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'

interface RequestOptions extends RequestInit {
    params?: Record<string, string | number | boolean | undefined>
}

async function fetcher<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options

    const url = new URL(`${API_BASE_URL}${endpoint}`)
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value))
            }
        })
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('coin_token') : null

    const headers = new Headers(init.headers)
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }
    if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(url.toString(), {
        ...init,
        headers,
    })

    if (response.status === 204) {
        return {} as T
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || response.statusText || 'An error occurred')
    }

    return data as T
}

export const api = {
    get: <T>(endpoint: string, options?: RequestOptions) =>
        fetcher<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        fetcher<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),

    put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        fetcher<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),

    patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
        fetcher<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),

    delete: <T>(endpoint: string, options?: RequestOptions) =>
        fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
}
