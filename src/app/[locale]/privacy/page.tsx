import PrivacyContent from '@/components/PrivacyContent'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - PetPedia',
  description: 'PetPedia Privacy Policy - how we handle your data',
  openGraph: { title: 'Privacy Policy | PetPedia', description: 'Learn how PetPedia handles your data and privacy.' },
}

export default function PrivacyPage() {
  return <PrivacyContent />
}