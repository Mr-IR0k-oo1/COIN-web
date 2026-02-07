import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EtherealBeamsHero from '@/components/ui/ethereal-beams-hero'

export default function ShowcasePage() {
  return (
    <>
      <Header />
      <main className="w-full min-h-screen">
        <EtherealBeamsHero
          title="CoIN — Collaborative Innovation Experience"
          description="Discover a new dimension of innovation tracking. Fluid interactions, responsive feedback, and cutting-edge technology for SREC's innovation platform."
          badgeText="Next.js + React Three Fiber"
          badgeLabel="Innovation"
          ctaButtons={[
            { text: 'Explore Hackathons', href: '/hackathons', primary: true },
            { text: 'Student Portal', href: '/student/login' },
          ]}
          microDetails={[
            'Interactive 3D Shader Landscapes',
            'Smooth Motion Animations',
            'Immersive User Experience',
          ]}
        />
      </main>
      <Footer />
    </>
  )
}
