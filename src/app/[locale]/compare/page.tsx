import { loadBreeds } from '@/lib/breeds'
import CompareView from '@/components/CompareView'

export const metadata = {
  title: 'Breed Comparison - PetPedia',
  description: 'Compare dog and cat breeds side-by-side across 10 professional dimensions'
}

export default function ComparePage() {
  const dogBreeds = loadBreeds('dog')
  const catBreeds = loadBreeds('cat')

  return <CompareView dogBreeds={dogBreeds} catBreeds={catBreeds} />
}