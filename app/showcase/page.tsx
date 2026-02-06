import SyntheticHero from '@/components/ui/synthetic-hero'

export default function ShowcasePage() {
  return (
    <div className="w-full min-h-screen">
      <SyntheticHero
        title="CoIN — Collaborative Innovation Experience"
        description="Discover a new dimension of innovation tracking. Fluid interactions, responsive feedback, and cutting-edge technology for SREC's innovation platform."
        badgeText="Next.js + React Three Fiber"
        badgeLabel="Innovation"
        ctaButtons={[
          { text: 'Explore Hackathons', href: '/hackathons', primary: true },
          { text: 'Report Participation', href: '/submit' },
        ]}
        microDetails={[
          'Interactive 3D Shader Landscapes',
          'Smooth Motion Animations',
          'Immersive User Experience',
        ]}
      />
    </div>
  )
}
