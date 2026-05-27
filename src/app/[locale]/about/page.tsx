import AboutContent from '@/components/AboutContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About - PetPedia',
  description: 'Learn about PetPedia, our mission, data sources, and team.',
  openGraph: { title: 'About PetPedia', description: 'Learn about PetPedia, our mission, data sources, and team.' },
}

export default function AboutPage() {
  return <AboutContent />
}