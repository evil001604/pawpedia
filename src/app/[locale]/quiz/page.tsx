import { loadBreeds } from '@/lib/breeds'
import QuizFlow from '@/components/QuizFlow'

export const metadata = {
  title: 'Pet Recommendation Quiz - PetPedia',
  description: 'Find your perfect pet with our AI-powered breed recommendation quiz'
}

export default function QuizPage() {
  const dogBreeds = loadBreeds('dog')
  const catBreeds = loadBreeds('cat')

  return <QuizFlow dogBreeds={dogBreeds} catBreeds={catBreeds} />
}