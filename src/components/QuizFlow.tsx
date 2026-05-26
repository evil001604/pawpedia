'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { QUESTIONS, QuizAnswer, matchBreeds, QuizResult } from '@/lib/quiz-matching'
import { Breed } from '@/types/breed'
import QuizResultView from './QuizResult'

type QuizScreen = 'type_select' | 'questions' | 'results'

interface QuizFlowProps {
  dogBreeds: Breed[]
  catBreeds: Breed[]
}

export default function QuizFlow({ dogBreeds, catBreeds }: QuizFlowProps) {
  const t = useTranslations('quiz')
  const [screen, setScreen] = useState<QuizScreen>('type_select')
  const [petType, setPetType] = useState<'dog' | 'cat'>('dog')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [results, setResults] = useState<QuizResult[]>([])

  const handleTypeSelect = (type: 'dog' | 'cat') => {
    setPetType(type)
    setScreen('questions')
    setCurrentQuestion(0)
    setAnswers([])
  }

  const handleAnswer = (optionId: string) => {
    const newAnswers = [...answers]
    const existingIndex = newAnswers.findIndex(
      a => a.questionId === QUESTIONS[currentQuestion].id
    )

    if (existingIndex >= 0) {
      newAnswers[existingIndex] = {
        questionId: QUESTIONS[currentQuestion].id,
        optionId
      }
    } else {
      newAnswers.push({
        questionId: QUESTIONS[currentQuestion].id,
        optionId
      })
    }

    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      const allBreeds = [...dogBreeds, ...catBreeds]
      const matched = matchBreeds(answers, allBreeds, petType)
      setResults(matched)
      setScreen('results')
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleRestart = () => {
    setScreen('type_select')
    setCurrentQuestion(0)
    setAnswers([])
    setResults([])
  }

  const handleSwitchSpecies = (type: 'dog' | 'cat') => {
    setPetType(type)
    setScreen('questions')
    setCurrentQuestion(0)
    setAnswers([])
    setResults([])
  }

  const currentAnswer = answers.find(
    a => a.questionId === QUESTIONS[currentQuestion].id
  )

  const isLastQuestion = currentQuestion === QUESTIONS.length - 1

  if (screen === 'results') {
    return <QuizResultView
      results={results}
      onRestart={handleRestart}
      onSwitchSpecies={handleSwitchSpecies}
      petType={petType}
      allBreeds={petType === 'dog' ? dogBreeds : catBreeds}
    />
  }

  if (screen === 'type_select') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="mb-4 text-4xl font-bold text-stone-900">{t('title')}</h1>
          <p className="mb-12 text-lg text-stone-600">{t('subtitle')}</p>

          <p className="mb-8 text-xl font-semibold text-stone-800">{t('selectPetType')}</p>

          <div className="flex justify-center gap-6">
            <button
              onClick={() => handleTypeSelect('dog')}
              className="rounded-xl border-2 border-stone-200 bg-white p-8 shadow-sm transition-all hover:border-blue-400 hover:shadow-md hover:-translate-y-1"
            >
              <div className="mb-3 text-5xl">🐕</div>
              <div className="text-lg font-semibold text-stone-800">{t('dog')}</div>
            </button>
            <button
              onClick={() => handleTypeSelect('cat')}
              className="rounded-xl border-2 border-stone-200 bg-white p-8 shadow-sm transition-all hover:border-blue-400 hover:shadow-md hover:-translate-y-1"
            >
              <div className="mb-3 text-5xl">🐈</div>
              <div className="text-lg font-semibold text-stone-800">{t('cat')}</div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  const question = QUESTIONS[currentQuestion]

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-8">
          <div className="mb-2 flex justify-between text-sm text-stone-500">
            <span>{t('question', { current: currentQuestion + 1, total: QUESTIONS.length })}</span>
            <span>{Math.round(((currentQuestion + 1) / QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-stone-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="mb-8 text-2xl font-bold text-stone-900">
          {petType === 'dog' ? question.questionEn : question.questionEn}
        </h2>

        <div className="space-y-3">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id)}
              className={`w-full rounded-xl border-2 p-5 text-left transition-all ${
                currentAnswer?.optionId === option.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  currentAnswer?.optionId === option.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-stone-300'
                }`}>
                  {currentAnswer?.optionId === option.id && (
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className={`text-base ${
                  currentAnswer?.optionId === option.id ? 'font-semibold text-blue-900' : 'text-stone-700'
                }`}>
                  {petType === 'dog' ? option.optionEn : option.optionEn}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="rounded-lg bg-stone-100 px-6 py-3 font-medium text-stone-700 transition-colors hover:bg-stone-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← {t('previous')}
          </button>

          <button
            onClick={handleNext}
            disabled={!currentAnswer}
            className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-stone-300 disabled:text-stone-500 disabled:cursor-not-allowed"
          >
            {isLastQuestion ? t('start') : t('next')} →
          </button>
        </div>
      </div>
    </div>
  )
}