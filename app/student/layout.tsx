'use client'

import { useEffect, useState } from 'react'
import { useStudentStore } from '@/lib/store/studentStore'
import { useRouter, usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { isAuthenticated, initializeAuth } = useStudentStore()
    const router = useRouter()
    const pathname = usePathname()
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        initializeAuth()
        setIsReady(true)
    }, [initializeAuth])

    useEffect(() => {
        if (!isReady) return

        const publicPages = ['/student/login', '/student/register']
        const isPublicPage = publicPages.includes(pathname)

        if (!isAuthenticated && !isPublicPage) {
            router.push('/student/login')
        } else if (isAuthenticated && isPublicPage) {
            router.push('/student/dashboard')
        }
    }, [isAuthenticated, pathname, router, isReady])

    if (!isReady) return null

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 pt-20">
                {children}
            </main>
            <Footer />
        </div>
    )
}

