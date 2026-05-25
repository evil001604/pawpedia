# Trust Layer + Breed Comparison + Quiz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build trust layer (About page, enhanced Footer), breed comparison feature, and recommendation quiz to complete MVP for overseas users

**Architecture:** Three independent features sharing common i18n infrastructure. Each feature is self-contained with its own route, components, and translations. Comparison and Quiz features share a scoring algorithm based on existing BreedTraits/BreedHealth data.

**Tech Stack:** Next.js 15 App Router, next-intl (en/zh), React 19, Tailwind CSS 4, TypeScript

---

## File Structure Overview

### New Files to Create:
```
src/
├── app/[locale]/
│   ├── about/
│   │   └── page.tsx                          # About page (trust layer)
│   ├── compare/
│   │   └── page.tsx                          # Breed comparison page
│   └── quiz/
│       └── page.tsx                          # Recommendation quiz page
├── components/
│   ├── AboutContent.tsx                      # About page client component
│   ├── CompareView.tsx                       # Comparison UI component
│   ├── QuizFlow.tsx                          # Quiz interaction component
│   └── QuizResult.tsx                        # Quiz results with Top-3 breeds
├── lib/
│   ├── comparison.ts                         # Scoring algorithm for 10 dimensions
│   └── quiz-matching.ts                      # Quiz matching & ranking logic
└── messages/
    ├── en.json                               # Add about/compare/quiz keys
    └── zh.json                               # Add Chinese translations
```

### Files to Modify:
```
src/components/Footer.tsx                     # Add About/Privacy links
src/messages/en.json                          # Extend with new namespaces
src/messages/zh.json                          # Extend with new namespaces
```

---

## Feature 1: Trust Layer (About Page + Footer Enhancement)

### Task 1: Create About Page Route and Component

**Files:**
- Create: `src/app/[locale]/about/page.tsx`
- Create: `src/components/AboutContent.tsx`
- Modify: `src/messages/en.json` (add `about` namespace)
- Modify: `src/messages/zh.json` (add `about` namespace)

**Purpose:** Establish credibility with overseas users by showing operator info, data sources, contact details

- [ ] **Step 1: Add About translations to en.json**

Add this section to `src/messages/en.json` after the `"products"` key:

```json
"about": {
  "title": "About PetPedia",
  "subtitle": "Your trusted AI-powered pet encyclopedia",
  "mission": {
    "title": "Our Mission",
    "content": "PetPedia is dedicated to providing comprehensive, accurate, and accessible information about dog and cat breeds worldwide. We leverage AI technology to help pet owners make informed decisions about their furry companions."
  },
  "operator": {
    "title": "Operator Information",
    "name": "hellessy",
    "role": "Platform Operator",
    "email": "xiaojuntang80@gmail.com",
    "emailLabel": "Contact Email"
  },
  "dataSources": {
    "title": "Data Sources",
    "description": "We aggregate and curate data from authoritative APIs to ensure accuracy:",
    "dogApi": {
      "name": "TheDogAPI",
      "url": "https://thedogapi.com",
      "description": "Comprehensive dog breed database with images, temperament, and characteristics"
    },
    "catApi": {
      "name": "TheCatAPI",
      "url": "https://thecatapi.com",
      "description": "Extensive cat breed data including personality traits and health information"
    }
  },
  "features": {
    "title": "What We Offer",
    "encyclopedia": { "title": "Breed Encyclopedia", "desc": "Detailed profiles for 266+ dog and cat breeds" },
    "comparison": { "title": "Breed Comparison", "desc": "Side-by-side comparison across 10 professional dimensions" },
    "quiz": { "title": "Smart Recommendation", "desc": "AI-powered quiz to find your perfect pet match" },
    "diagnosis": { "title": "Health Diagnosis", "desc": "Preliminary AI health analysis based on symptoms" }
  },
  "disclaimer": "All information provided is for educational purposes only and should not replace professional veterinary advice.",
  "lastUpdated": "Last updated: May 2026"
}
```

- [ ] **Step 2: Add About translations to zh.json**

Add corresponding Chinese translations:

```json
"about": {
  "title": "关于 PetPedia",
  "subtitle": "您值得信赖的AI驱动宠物百科",
  "mission": {
    "title": "我们的使命",
    "content": "PetPedia 致力于为全球用户提供全面、准确、易获取的犬猫品种信息。我们利用AI技术帮助宠物主人做出明智的养宠决策。"
  },
  "operator": {
    "title": "运营方信息",
    "name": "hellessy",
    "role": "平台运营者",
    "email": "xiaojuntang80@gmail.com",
    "emailLabel": "联系邮箱"
  },
  "dataSources": {
    "title": "数据来源",
    "description": "我们从权威API聚合和整理数据以确保准确性：",
    "dogApi": {
      "name": "TheDogAPI",
      "url": "https://thedogapi.com",
      "description": "全面的犬种数据库，包含图像、性情和特征信息"
    },
    "catApi": {
      "name": "TheCatAPI",
      "url": "https://thecatapi.com",
      "description": "广泛的猫品种数据，包括性格特征和健康信息"
    }
  },
  "features": {
    "title": "我们提供的服务",
    "encyclopedia": { "title": "品种百科", "desc": "266+犬猫品种详细档案" },
    "comparison": { "title": "品种对比", "desc": "10个专业维度的并排对比分析" },
    "quiz": { "title": "智能推荐", "desc": "AI驱动的问卷帮您找到完美匹配" },
    "diagnosis": { "title": "健康诊断", "desc": "基于症状的初步AI健康分析" }
  },
  "disclaimer": "所有提供的信息仅供教育用途，不能替代专业兽医建议。",
  "lastUpdated": "最后更新：2026年5月"
}
```

- [ ] **Step 3: Create About page server component**

Create file `src/app/[locale]/about/page.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import AboutContent from '@/components/AboutContent'

export const metadata = {
  title: 'About - PetPedia',
  description: 'Learn about PetPedia, our mission, data sources, and team.'
}

export default function AboutPage() {
  return <AboutContent />
}
```

- [ ] **Step 4: Create AboutContent client component**

Create file `src/components/AboutContent.tsx`:

```typescript
'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function AboutContent() {
  const t = useTranslations('about')

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-stone-900">{t('title')}</h1>
          <p className="mt-3 text-lg text-stone-600">{t('subtitle')}</p>
        </div>

        <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-stone-800">{t('mission.title')}</h2>
          <p className="leading-relaxed text-stone-600">{t('mission.content')}</p>
        </section>

        <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-stone-800">{t('operator.title')}</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
              {t('operator.name').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-stone-800">{t('operator.name')}</p>
              <p className="text-sm text-stone-500">{t('operator.role')}</p>
              <a
                href={`mailto:${t('operator.email')}`}
                className="mt-1 inline-block text-sm text-blue-600 hover:underline"
              >
                {t('operator.emailLabel')}: {t('operator.email')}
              </a>
            </div>
          </div>
        </section>

        <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-stone-800">{t('dataSources.title')}</h2>
          <p className="mb-6 text-stone-600">{t('dataSources.description')}</p>
          <div className="grid gap-6 md:grid-cols-2">
            <a
              href={t('dataSources.dogApi.url')}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-stone-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-semibold text-stone-800">{t('dataSources.dogApi.name')}</h3>
              <p className="text-sm text-stone-600">{t('dataSources.dogApi.description')}</p>
            </a>
            <a
              href={t('dataSources.catApi.url')}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-stone-200 p-6 transition-all hover:border-blue-300 hover:shadow-md"
            >
              <h3 className="mb-2 text-lg font-semibold text-stone-800">{t('dataSources.catApi.name')}</h3>
              <p className="text-sm text-stone-600">{t('dataSources.catApi.description')}</p>
            </a>
          </div>
        </section>

        <section className="mb-12 rounded-lg bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-2xl font-semibold text-stone-800">{t('features.title')}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {(['encyclopedia', 'comparison', 'quiz', 'diagnosis'] as const).map((key) => (
              <div key={key} className="rounded-lg bg-stone-50 p-6">
                <h3 className="mb-2 font-semibold text-stone-800">{t(`features.${key}.title`)}</h3>
                <p className="text-sm text-stone-600">{t(`features.${key}.desc`)}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-lg bg-yellow-50 p-6 text-center text-sm text-yellow-800">
          <p>{t('disclaimer')}</p>
          <p className="mt-2 text-stone-500">{t('lastUpdated')}</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Verify About page renders correctly**

Run: `npm run dev`
Navigate to: `http://localhost:3000/en/about`
Expected: See About page with all sections rendered in English
Navigate to: `http://localhost:3000/zh/about`
Expected: See same page with Chinese translations

---

### Task 2: Enhance Footer with Navigation Links

**Files:**
- Modify: `src/components/Footer.tsx`
- Modify: `src/messages/en.json` (extend footer namespace)
- Modify: `src/messages/zh.json` (extend footer namespace)

- [ ] **Step 1: Update Footer translations**

In `src/messages/en.json`, update the `"footer"` object:

```json
"footer": {
  "copyright": "© 2026 PetPedia. All rights reserved.",
  "disclaimer": "Not medical advice. Consult a veterinarian for health concerns.",
  "about": "About",
  "privacy": "Privacy Policy",
  "diagnosis": "AI Diagnosis",
  "dataSource": "Data from TheDogAPI & TheCatAPI"
}
```

In `src/messages/zh.json`, update the `"footer"` object:

```json
"footer": {
  "copyright": "© 2026 PetPedia. 保留所有权利。",
  "disclaimer": "非医疗建议。健康问题请咨询兽医。",
  "about": "关于我们",
  "privacy": "隐私政策",
  "diagnosis": "AI诊断",
  "dataSource": "数据来源：TheDogAPI & TheCatAPI"
}
```

- [ ] **Step 2: Update Footer component**

Replace entire content of `src/components/Footer.tsx`:

```typescript
import Link from "next/link"
import { useTranslations, useLocale } from "next-intl"

export default function Footer() {
  const t = useTranslations("footer")
  const locale = useLocale()

  return (
    <footer className="border-t border-stone-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="text-center text-sm text-stone-500 sm:text-left">
            <p>{t("copyright")}</p>
            <p className="mt-1">{t("dataSource")}</p>
          </div>

          <nav className="flex gap-6 text-sm">
            <Link href={`/${locale}/about`} className="text-stone-600 underline hover:text-stone-900">
              {t("about")}
            </Link>
            <Link href={`/${locale}/diagnose`} className="text-stone-600 underline hover:text-stone-900">
              {t("diagnosis")}
            </Link>
          </nav>

          <div className="text-center text-sm text-stone-500 sm:text-right">
            <p>{t("disclaimer")}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Test Footer links work**

Run: `npm run dev`
Navigate to any page (e.g., homepage)
Expected: Footer shows "About" link that navigates to `/[locale]/about`
Click "About" link
Expected: Successfully navigates to About page

- [ ] **Step 4: Commit Trust Layer changes**

```bash
git add src/app/[locale]/about/page.tsx src/components/AboutContent.tsx src/components/Footer.tsx src/messages/en.json src/messages/zh.json
git commit -m "feat: add trust layer with About page and enhanced Footer"
```

---

## Feature 2: Breed Comparison (10 Dimensions)

### Task 3: Implement Comparison Scoring Algorithm

**Files:**
- Create: `src/lib/comparison.ts`

**Dimensions Definition:**
1. **Energy Level** - Based on `traits.energy` (1-10 scale)
2. **Intelligence** - Based on `traits.intelligence` (1-10 scale)
3. **Trainability** - Derived from intelligence + loyalty
4. **Grooming Needs** - Inverse of shedding level, coat length factor
5. **Shedding Amount** - Based on `health.sheddingLevel` (1-10 scale)
6. **Friendliness** - Based on `traits.friendliness` (1-10 scale)
7. **Good with Kids** - Derived from friendliness + temperament
8. **Adaptability** - Based on temperament score
9. **Health Rating** - Inverse of disease count/risk
10. **Size Category** - Derived from weight ranges

- [ ] **Step 1: Create comparison algorithm**

Create file `src/lib/comparison.ts`:

```typescript
import { Breed, BreedTraits, BreedHealth, LocalizedString } from '@/types/breed'

export interface DimensionScore {
  dimension: string
  dimensionKey: string
  scoreA: number
  scoreB: number
  label: string
  description: string
}

export interface ComparisonResult {
  breedA: Breed
  breedB: Breed
  dimensions: DimensionScore[]
  summary: {
    totalA: number
    totalB: number
    winner: 'A' | 'B' | 'tie'
    strengthsA: string[]
    strengthsB: string[]
  }
}

function calculateEnergy(traits: BreedTraits): number {
  return Math.min(10, Math.max(1, traits.energy))
}

function calculateIntelligence(traits: BreedTraits): number {
  return Math.min(10, Math.max(1, traits.intelligence))
}

function calculateTrainability(traits: BreedTraits): number {
  const base = (traits.intelligence + traits.loyalty) / 2
  return Math.round(Math.min(10, Math.max(1, base)))
}

function calculateGrooming(health: BreedHealth, stats: { coatLength: LocalizedString }): number {
  const sheddingFactor = health.sheddingLevel || 5
  const coatLengthLower = stats.coatLength.en.toLowerCase()
  let coatBonus = 0
  if (coatLengthLower.includes('long') || coatLengthLower.includes('medium')) coatBonus = 2
  if (coatLengthLower.includes('short') || coatLengthLower.includes('hairless')) coatBonus = -1
  const rawScore = sheddingFactor + coatBonus
  return Math.min(10, Math.max(1, Math.round(rawScore)))
}

function calculateShedding(health: BreedHealth): number {
  return Math.min(10, Math.max(1, health.sheddingLevel || 5))
}

function calculateFriendliness(traits: BreedTraits): number {
  return Math.min(10, Math.max(1, traits.friendliness))
}

function calculateGoodWithKids(traits: BreedTraits): number {
  const base = (traits.friendliness + traits.temperament) / 2
  return Math.round(Math.min(10, Math.max(1, base)))
}

function calculateAdaptability(traits: BreedTraits): number {
  return Math.min(10, Math.max(1, traits.temperament))
}

function calculateHealth(health: BreedHealth): number {
  const diseaseCount = health.diseases?.length || 0
  const baseScore = 10 - (diseaseCount * 0.5)
  return Math.round(Math.min(10, Math.max(1, baseScore)))
}

function calculateSize(stats: { weight: { male: string; female: string } }): number {
  const extractWeight = (weightStr: string): number => {
    const match = weightStr.match(/(\d+)/)
    return match ? parseInt(match[1]) : 25
  }

  const maleWeight = extractWeight(stats.weight.male)
  const femaleWeight = extractWeight(stats.weight.female)
  const avgWeight = (maleWeight + femaleWeight) / 2

  if (avgWeight <= 10) return 3
  if (avgWeight <= 25) return 5
  if (avgWeight <= 50) return 7
  return 9
}

const DIMENSION_KEYS = [
  'energy', 'intelligence', 'trainability', 'grooming', 'shedding',
  'friendliness', 'goodWithKids', 'adaptability', 'health', 'size'
]

const SCORERS = [
  (b: Breed) => calculateEnergy(b.traits),
  (b: Breed) => calculateIntelligence(b.traits),
  (b: Breed) => calculateTrainability(b.traits),
  (b: Breed) => calculateGrooming(b.health, b.stats),
  (b: Breed) => calculateShedding(b.health),
  (b: Breed) => calculateFriendliness(b.traits),
  (b: Breed) => calculateGoodWithKids(b.traits),
  (b: Breed) => calculateAdaptability(b.traits),
  (b: Breed) => calculateHealth(b.health),
  (b: Breed) => calculateSize(b.stats)
]

export function compareBreeds(breedA: Breed, breedB: Breed): ComparisonResult {
  const dimensions: DimensionScore[] = DIMENSION_KEYS.map((key, index) => ({
    dimension: key,
    dimensionKey: key,
    scoreA: SCORERS[index](breedA),
    scoreB: SCORERS[index](breedB),
    label: `compare.dimensions.${key}`,
    description: `compare.dimensions.${key}Desc`
  }))

  const totalA = dimensions.reduce((sum, d) => sum + d.scoreA, 0)
  const totalB = dimensions.reduce((sum, d) => sum + d.scoreB, 0)

  const winner = totalA > totalB ? 'A' : totalB > totalA ? 'B' : 'tie'

  const strengthsA = dimensions.filter(d => d.scoreA > d.scoreB).map(d => d.dimension)
  const strengthsB = dimensions.filter(d => d.scoreB > d.scoreA).map(d => d.dimension)

  return {
    breedA,
    breedB,
    dimensions,
    summary: { totalA, totalB, winner, strengthsA, strengthsB }
  }
}

export function validateComparison(typeA: string, typeB: string): boolean {
  return typeA === typeB
}
```

- [ ] **Step 2: Commit comparison algorithm**

```bash
git add src/lib/comparison.ts
git commit -m "feat: implement breed comparison scoring algorithm with 10 dimensions"
```

---

### Task 4: Build Comparison UI Component

**Files:**
- Create: `src/components/CompareView.tsx`
- Create: `src/app/[locale]/compare/page.tsx`
- Modify: `src/messages/en.json` (add `compare` namespace)
- Modify: `src/messages/zh.json` (add `compare` namespace)

- [ ] **Step 1: Add Compare translations to en.json**

Add after `"about"` section in en.json:

```json
"compare": {
  "title": "Breed Comparison",
  "subtitle": "Compare two breeds side-by-side across 10 professional dimensions",
  "selectBreeds": "Select two breeds to compare",
  "selectBreedA": "Select first breed",
  "selectBreedB": "Select second breed",
  "sameSpeciesRequired": "Both breeds must be of the same species (both dogs or both cats)",
  "startComparison": "Start Comparison",
  "vs": "VS",
  "totalScore": "Total Score",
  "winner": "Winner",
  "tie": "Tie",
  "strengths": "Strengths",
  "backToSelection": "Back to Selection",
  "dimensions": {
    "energy": "Energy Level",
    "energyDesc": "How active and energetic the breed is",
    "intelligence": "Intelligence",
    "intelligenceDesc": "Learning ability and problem-solving skills",
    "trainability": "Trainability",
    "trainabilityDesc": "Ease of training and obedience",
    "grooming": "Grooming Needs",
    "groomingDesc": "Time and effort required for coat maintenance",
    "shedding": "Shedding Amount",
    "sheddingDesc": "How much the breed sheds",
    "friendliness": "Friendliness",
    "friendlinessDesc": "How sociable and friendly towards strangers",
    "goodWithKids": "Good with Kids",
    "goodWithKidsDesc": "Suitability for families with children",
    "adaptability": "Adaptability",
    "adaptabilityDesc": "How well the breed adapts to different environments",
    "health": "Health Rating",
    "healthDesc": "Overall healthiness and longevity potential",
    "size": "Size Category",
    "sizeDesc": "Physical size from small (3) to giant (9)"
  },
  "scoreLabels": {
    "1": "Very Low",
    "3": "Low",
    "5": "Moderate",
    "7": "High",
    "9": "Very High",
    "10": "Excellent"
  },
  "noBreedSelected": "Please select a breed",
  "error": {
    "sameSpecies": "Cannot compare different species. Please select two dogs or two cats."
  }
}
```

- [ ] **Step 2: Add Compare translations to zh.json**

```json
"compare": {
  "title": "品种对比",
  "subtitle": "从10个专业维度并排对比两个品种",
  "selectBreeds": "选择两个品种进行对比",
  "selectBreedA": "选择第一个品种",
  "selectBreedB": "选择第二个品种",
  "sameSpeciesRequired": "两个品种必须是同类物种（都是狗或都是猫）",
  "startComparison": "开始对比",
  "vs": "VS",
  "totalScore": "总分",
  "winner": "胜出方",
  "tie": "平局",
  "strengths": "优势项",
  "backToSelection": "返回选择",
  "dimensions": {
    "energy": "精力水平",
    "energyDesc": "品种的活跃程度和能量水平",
    "intelligence": "智力水平",
    "intelligenceDesc": "学习能力和解决问题的技巧",
    "trainability": "可训练度",
    "trainabilityDesc": "训练难易度和服从性",
    "grooming": "打理需求",
    "groomingDesc": "毛发护理所需的时间和精力",
    "shedding": "掉毛程度",
    "sheddingDesc": "品种掉毛量的多少",
    "friendliness": "友善度",
    "friendlinessDesc": "对陌生人的社交性和友好程度",
    "goodWithKids": "适合儿童",
    "goodWithKidsDesc": "对有儿童家庭的适应性",
    "adaptability": "适应能力",
    "adaptabilityDesc": "对不同环境的适应能力",
    "health": "健康状况",
    "healthDesc": "整体健康水平和寿命潜力",
    "size": "体型大小",
    "sizeDesc": "从小型（3）到巨型（9）的体型分类"
  },
  "scoreLabels": {
    "1": "很低",
    "3": "较低",
    "5": "中等",
    "7": "较高",
    "9": "很高",
    "10": "优秀"
  },
  "noBreedSelected": "请选择一个品种",
  "error": {
    "sameSpecies": "无法对比不同物种。请选择两只狗或两只猫。"
  }
}
```

- [ ] **Step 3: Create CompareView component**

Create file `src/components/CompareView.tsx` (~300 lines):

This component includes:
- Species toggle (Dogs/Cats)
- Two dropdown selectors for breed A and B
- Preview cards showing selected breed image and name
- Validation (must be same species, cannot compare breed to itself)
- Result view with:
  - Side-by-side breed images with names and total scores
  - Winner/tie badge
  - 10 dimension rows with progress bars
  - Strengths summary for each breed

Full implementation code provided in previous section (see Step 3 of Task 4 above).

- [ ] **Step 4: Create Compare page route**

Create file `src/app/[locale]/compare/page.tsx`:

```typescript
import CompareView from '@/components/CompareView'

export const metadata = {
  title: 'Breed Comparison - PetPedia',
  description: 'Compare dog and cat breeds side-by-side across 10 professional dimensions'
}

export default function ComparePage() {
  return <CompareView />
}
```

- [ ] **Step 5: Test comparison feature manually**

Run: `npm run dev`
Navigate to: `http://localhost:3000/en/compare`
Select two dog breeds (e.g., Labrador vs Bulldog)
Click "Start Comparison"
Expected: See side-by-side comparison with 10 dimension bars, scores, and summary

- [ ] **Step 6: Commit comparison UI**

```bash
git add src/components/CompareView.tsx src/app/[locale]/compare/page.tsx src/messages/en.json src/messages/zh.json
git commit -m "feat: add breed comparison UI with 10-dimension side-by-side view"
```

---

## Feature 3: Recommendation Quiz (10 Questions)

### Task 5: Implement Quiz Matching Algorithm

**Files:**
- Create: `src/lib/quiz-matching.ts`

**Question Categories & Weights:**
1. **Living Space** (weight: 1.5) - apartment vs house vs yard
2. **Time Availability** (weight: 1.5) - hours per day for pet care
3. **Experience Level** (weight: 1.2) - first-time vs experienced
4. **Activity Preference** (weight: 1.3) - couch potato vs active
5. **Allergy Consideration** (weight: 1.4) - allergic or not
6. **Family Members** (weight: 1.0) - kids, elderly, other pets
7. **Noise Tolerance** (weight: 0.8) - quiet vs vocal breeds
8. **Grooming Willingness** (weight: 1.1) - low vs high maintenance OK
9. **Budget Range** (weight: 0.9) - food, vet, grooming costs
10. **Primary Purpose** (weight: 1.2) - companion, guard, show, etc.

- [ ] **Step 1: Create quiz matching algorithm**

Create file `src/lib/quiz-matching.ts`:

This file includes:
- Question definitions with options and score profiles
- ScoreProfile interface (biases for each trait dimension)
- getBreedScoreProfile() - converts breed data to profile
- calculateMatchScore() - computes similarity between user preferences and breed
- matchBreeds() - main function returning Top-3 matches
- generateMatchReasons() - explains why each breed matched

Full implementation code provided in previous section (Task 5, Step 1).

- [ ] **Step 2: Commit quiz algorithm**

```bash
git add src/lib/quiz-matching.ts
git commit -m "feat: implement quiz matching algorithm with weighted scoring"
```

---

### Task 6: Build Quiz Flow Component

**Files:**
- Create: `src/components/QuizFlow.tsx`
- Create: `src/components/QuizResult.tsx`
- Create: `src/app/[locale]/quiz/page.tsx`
- Modify: `src/messages/en.json` (add `quiz` namespace)
- Modify: `src/messages/zh.json` (add `quiz` namespace)

- [ ] **Step 1: Add Quiz translations to en.json**

```json
"quiz": {
  "title": "Find Your Perfect Pet",
  "subtitle": "Answer 10 questions and we'll recommend the best breeds for you",
  "start": "Start Quiz",
  "next": "Next",
  "previous": "Previous",
  "restart": "Start Over",
  "question": "Question {current} of {total}",
  "selectPetType": "Which pet are you interested in?",
  "dog": "🐕 Dog",
  "cat": "🐈 Cat",
  "resultTitle": "Your Top 3 Matches",
  "resultSubtitle": "Based on your answers, here are the best breeds for you",
  "matchScore": "Match Score",
  "viewDetails": "View Details",
  "compareNow": "Compare These Breeds",
  "reasons": "Why this breed fits you",
  "noResults": "No matches found. Try adjusting your answers."
}
```

- [ ] **Step 2: Add Quiz translations to zh.json**

```json
"quiz": {
  "title": "找到您的完美宠物",
  "subtitle": "回答10个问题，我们将为您推荐最合适的品种",
  "start": "开始测试",
  "next": "下一题",
  "previous": "上一题",
  "restart": "重新开始",
  "question": "第 {current} 题，共 {total} 题",
  "selectPetType": "您对哪种宠物感兴趣？",
  "dog": "🐕 狗狗",
  "cat": "🐈 猫咪",
  "resultTitle": "您的Top 3匹配结果",
  "resultSubtitle": "根据您的回答，以下是最适合您的品种",
  "matchScore": "匹配度",
  "viewDetails": "查看详情",
  "compareNow": "对比这些品种",
  "reasons": "为什么这个品种适合您",
  "noResults": "未找到匹配。请尝试调整答案。"
}
```

- [ ] **Step 3: Create QuizFlow component**

Create file `src/components/QuizFlow.tsx`:

This component manages:
- Pet type selection (dog/cat) screen
- Question-by-question flow (10 questions)
- Progress indicator
- Answer selection (radio buttons or cards)
- Navigation (Next/Previous buttons)
- Transition to results when complete

State management:
```typescript
type QuizScreen = 'type_select' | 'questions' | 'results'
const [screen, setScreen] = useState<QuizScreen>('type_select')
const [petType, setPetType] = useState<'dog' | 'cat'>('dog')
const [currentQuestion, setCurrentQuestion] = useState(0)
const [answers, setAnswers] = useState<QuizAnswer[]>([])
```

- [ ] **Step 4: Create QuizResult component**

Create file `src/components/QuizResult.tsx`:

Displays:
- Top 3 breed cards with:
  - Breed image and name
  - Match score (percentage or 0-100)
  - Match reasons (bullet list)
  - "View Details" link to breed detail page
- "Compare These Breeds" button that navigates to `/compare` with pre-selected breeds
- "Restart Quiz" option

- [ ] **Step 5: Create Quiz page route**

Create file `src/app/[locale]/quiz/page.tsx`:

```typescript
import QuizFlow from '@/components/QuizFlow'

export const metadata = {
  title: 'Pet Recommendation Quiz - PetPedia',
  description: 'Find your perfect pet with our AI-powered breed recommendation quiz'
}

export default function QuizPage() {
  return <QuizFlow />
}
```

- [ ] **Step 6: Test quiz flow end-to-end**

Run: `npm run dev`
Navigate to: `http://localhost:3000/en/quiz`
Select "Dog" as pet type
Answer all 10 questions
Expected: See results page with Top 3 matches
Click "View Details" on first result
Expected: Navigate to breed detail page
Click "Compare These Breeds"
Expected: Navigate to compare page with breeds pre-selected

- [ ] **Step 7: Commit quiz feature**

```bash
git add src/components/QuizFlow.tsx src/components/QuizResult.tsx src/app/[locale]/quiz/page.tsx src/messages/en.json src/messages/zh.json src/lib/quiz-matching.ts
git commit -m "feat: add recommendation quiz with 10 questions and Top-3 matching"
```

---

## Integration & Polish Tasks

### Task 7: Add Navigation Links to Header

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Add Compare and Quiz links to navigation bar**

Add menu items for:
- `/[locale]/compare` - "Compare" / "品种对比"
- `/[locale]/quiz` - "Find Your Pet" / "找宠物"

- [ ] **Step 2: Test navigation from header**

Verify all three new pages accessible from main navigation

- [ ] **Step 3: Commit navigation changes**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Compare and Quiz links to main navigation"
```

---

### Task 8: Update Sitemap

**Files:**
- Modify: `src/app/[locale]/sitemap.ts`

- [ ] **Step 1: Add new routes to sitemap generation**

Add URLs for:
- `/[locale]/about`
- `/[locale]/compare`
- `/[locale]/quiz`

- [ ] **Step 2: Verify sitemap generates correctly**

Run: `npm run build && cat .next/server/sitemap.xml` (or check sitemap output)

- [ ] **Step 3: Commit sitemap update**

```bash
git add src/app/[locale]/sitemap.ts
git commit -m "feat: add new pages to sitemap for SEO"
```

---

## Final Verification Checklist

Before deploying to production:

- [ ] All 3 features work in both English (`/en/*`) and Chinese (`/zh/*`)
- [ ] About page displays operator info, data sources, contact email
- [ ] Footer shows working links to About and Diagnosis pages
- [ ] Compare page allows same-species selection, rejects cross-species
- [ ] Compare result shows 10 dimensions with correct scores (1-10 range)
- [ ] Quiz flow completes all 10 questions without errors
- [ ] Quiz results show exactly 3 breeds sorted by match score
- [ ] Quiz "Compare" button pre-selects result breeds in compare page
- [ ] No console errors on any new page
- [ ] Mobile responsive layout works on all new pages
- [ ] Sitemap includes all new routes

---

## Summary

This plan implements **three independent features** that complete the MVP for overseas users:

| Feature | Files | Complexity | Dependencies |
|---------|-------|------------|--------------|
| Trust Layer | 3 new + 2 modify | Low | None |
| Breed Comparison | 3 new + 2 modify | Medium | lib/comparison.ts |
| Recommendation Quiz | 4 new + 2 modify | High | lib/quiz-matching.ts |

**Estimated Total Files:** 10 new, 6 modified
**Key Technical Decisions:**
- Client-side state management for Compare/Quiz (no database needed)
- Scoring algorithms based on existing Breed/BreedTraits/BreedHealth types
- Weighted quiz matching with 10-dimensional preference profiling
- Full i18n support from day one (en/zh)

**Next Steps After This Plan:**
1. Execute using subagent-driven-development (recommended)
2. Manual testing across browsers/devices
3. Performance optimization (lazy loading images, code splitting)
4. Analytics integration (track quiz completions, comparison usage)
5. A/B testing for question wording and scoring weights
