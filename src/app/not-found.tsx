import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — Page Not Found | PetPedia',
  description: 'The page you are looking for does not exist. Browse our pet breed encyclopedia instead.',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="text-center">
        <p className="text-8xl font-bold text-stone-300">404</p>
        <h1 className="mt-4 text-2xl font-bold text-stone-800">Page not found</h1>
        <p className="mt-2 text-stone-500">The page you are looking for does not exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Back to Home
        </Link>
      </div>
    </div>
  )
}