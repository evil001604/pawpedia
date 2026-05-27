import { loadBreeds } from '@/lib/breeds'
import QuizFlow from '@/components/QuizFlow'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pet Recommendation Quiz - PetPedia',
  description: 'Find your perfect pet with our AI-powered breed recommendation quiz',
  openGraph: {
    title: 'Find Your Perfect Pet - Quiz | PetPedia',
    description: 'Answer 10 questions and get personalized breed recommendations powered by AI.',
  },
}

export default function QuizPage() {
  const dogBreeds = loadBreeds('dog')
  const catBreeds = loadBreeds('cat')

  return <QuizFlow dogBreeds={dogBreeds} catBreeds={catBreeds} />
}