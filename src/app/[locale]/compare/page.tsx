import { loadBreeds } from '@/lib/breeds'
import CompareView from '@/components/CompareView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Breed Comparison - PetPedia',
  description: 'Compare dog and cat breeds side-by-side across 10 professional dimensions',
  openGraph: {
    title: 'Breed Comparison - Compare Pets Side by Side | PetPedia',
    description: 'Compare dog and cat breeds across 10 dimensions including energy, intelligence, health, and more.',
  },
}

export default function ComparePage() {
  const dogBreeds = loadBreeds('dog')
  const catBreeds = loadBreeds('cat')

  return <CompareView dogBreeds={dogBreeds} catBreeds={catBreeds} />
}