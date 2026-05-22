# AI Pet Encyclopedia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (EN/ZH) pet breed encyclopedia with 266 breeds, radar charts, health info, AI diagnosis FAQ, and product recommendations — deployable on Vercel at zero cost.

**Architecture:** Next.js 15 App Router with next-intl for i18n. All breed pages are SSG (static site generation) reading from local JSON files. Diagnosis page is a client component using keyword matching. Two API Routes handle diagnosis and analytics. All styles via Tailwind CSS 4.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS 4, next-intl, Recharts, static JSON data

---

### Task 1: Initialize Next.js Project

**Files:**
- Create: `src/app/layout.tsx`
- Create: `next.config.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`
- Modify: `.gitignore`

- [ ] **Step 1: Create Next.js app**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Add root layout with Tailwind v4 import**

Create `src/app/globals.css`:
```css
@import "tailwindcss";
```

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pet Breed Encyclopedia | AI Pet Health",
  description: "Explore 266+ dog and cat breeds. Radar charts, health info, AI diagnosis, and pet product recommendations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install next-intl recharts
npm install @next/bundle-analyzer --save-dev
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: Successful build with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: initialize Next.js 15 project with Tailwind CSS"
```

---

### Task 2: Set Up i18n with next-intl

**Files:**
- Create: `src/i18n/request.ts`
- Create: `src/i18n/routing.ts`
- Create: `src/messages/en.json`
- Create: `src/messages/zh.json`
- Create: `src/middleware.ts`
- Create: `src/app/[locale]/layout.tsx`
- Modify: `next.config.ts`

- [ ] **Step 1: Create i18n configuration**

Create `src/i18n/routing.ts`:
```ts
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "zh"],
  defaultLocale: "en",
  localePrefix: "always",
});
```

Create `src/i18n/request.ts`:
```ts
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as "en" | "zh")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 2: Create message files**

Create `src/messages/en.json`:
```json
{
  "site": {
    "title": "Pet Breed Encyclopedia",
    "description": "Explore 266+ dog and cat breeds with detailed traits, health info, and AI diagnosis."
  },
  "nav": {
    "home": "Home",
    "breeds": "Breeds",
    "dogs": "Dogs",
    "cats": "Cats",
    "health": "Health",
    "diagnose": "AI Diagnosis",
    "search": "Search breeds..."
  },
  "home": {
    "hero": "Discover Your Perfect Pet",
    "subtitle": "Explore 266+ breeds with comprehensive guides on personality, intelligence, health, and history.",
    "exploreDogs": "Explore Dogs",
    "exploreCats": "Explore Cats",
    "tryDiagnosis": "Try AI Diagnosis",
    "breedCount": "{count}+ breeds",
    "features": {
      "traits": { "title": "Personality Traits", "desc": "Radar charts showing temperament, loyalty, intelligence, and more." },
      "health": { "title": "Health Info", "desc": "Shedding levels, common diseases, lifespan, and care tips." },
      "diagnosis": { "title": "AI Diagnosis", "desc": "Describe symptoms and get preliminary health suggestions." },
      "products": { "title": "Product Picks", "desc": "Recommended supplies matched to each breed." }
    }
  },
  "breeds": {
    "title": "{type} Breeds",
    "dogs": "Dog Breeds",
    "cats": "Cat Breeds",
    "searchPlaceholder": "Search by breed name...",
    "filter": "Filters",
    "noResults": "No breeds found matching your criteria.",
    "traits": "Traits",
    "origin": "Origin",
    "lifespan": "Lifespan",
    "weight": "Weight"
  },
  "detail": {
    "overview": "Overview",
    "history": "History & Origin",
    "traits": "Personality Traits",
    "health": "Health & Care",
    "products": "Recommended Products",
    "shedding": "Shedding",
    "personality": "Personality",
    "temperament": "Temperament",
    "loyalty": "Loyalty",
    "intelligence": "Intelligence",
    "friendliness": "Friendliness",
    "energy": "Energy Level",
    "careTips": "Care Tips",
    "diseases": "Common Health Issues",
    "probability": "Risk",
    "symptoms": "Symptoms",
    "prevention": "Prevention"
  },
  "health": {
    "title": "Health Encyclopedia",
    "subtitle": "Learn about common health issues, care guides, and preventive measures for your pet.",
    "byBreed": "By Breed",
    "generalTips": "General Care Tips",
    "sheddingLevels": { "1": "Minimal", "2": "Low", "3": "Moderate", "4": "High", "5": "Very High" }
  },
  "diagnose": {
    "title": "AI Pet Diagnosis",
    "subtitle": "Select symptoms to get preliminary health suggestions. This is not a substitute for professional veterinary care.",
    "selectType": "Select your pet type",
    "dog": "Dog",
    "cat": "Cat",
    "selectSymptoms": "Select symptoms",
    "results": "Possible Conditions",
    "disclaimer": "This tool provides informational suggestions only. Please consult a veterinarian for accurate diagnosis.",
    "resultsCount": "Based on your selections, here are {count} possible conditions:"
  },
  "products": {
    "title": "Recommended for {breed}",
    "bowl": "Food Bowl",
    "leash": "Leash & Collar",
    "bed": "Pet Bed",
    "toy": "Interactive Toy",
    "grooming": "Grooming Kit",
    "food": "Premium Food",
    "crate": "Training Crate",
    "scratch": "Scratching Post"
  },
  "common": {
    "back": "Back",
    "viewAll": "View All",
    "loading": "Loading...",
    "male": "Male",
    "female": "Female"
  }
}
```

Create `src/messages/zh.json`:
```json
{
  "site": {
    "title": "宠物品种百科",
    "description": "探索266+种猫狗品种，了解详细性格特征、健康信息和AI诊断。"
  },
  "nav": {
    "home": "首页",
    "breeds": "品种",
    "dogs": "狗",
    "cats": "猫",
    "health": "健康",
    "diagnose": "AI诊断",
    "search": "搜索品种..."
  },
  "home": {
    "hero": "发现你的完美宠物",
    "subtitle": "探索266+品种，获取全面的性格、智商、健康和历史指南。",
    "exploreDogs": "探索狗狗品种",
    "exploreCats": "探索猫咪品种",
    "tryDiagnosis": "试用AI诊断",
    "breedCount": "{count}+ 品种",
    "features": {
      "traits": { "title": "性格特征", "desc": "雷达图展示性格、脾气、忠诚度、智商等维度。" },
      "health": { "title": "健康信息", "desc": "掉毛程度、常见疾病、寿命和护理建议。" },
      "diagnosis": { "title": "AI诊断", "desc": "描述症状，获取初步健康建议。" },
      "products": { "title": "用品推荐", "desc": "根据品种特性匹配的推荐用品。" }
    }
  },
  "breeds": {
    "title": "{type} 品种",
    "dogs": "狗品种",
    "cats": "猫品种",
    "searchPlaceholder": "按品种名称搜索...",
    "filter": "筛选",
    "noResults": "未找到匹配的品种。",
    "traits": "特征",
    "origin": "原产地",
    "lifespan": "寿命",
    "weight": "体重"
  },
  "detail": {
    "overview": "概览",
    "history": "历史与起源",
    "traits": "性格特征",
    "health": "健康与护理",
    "products": "推荐用品",
    "shedding": "掉毛程度",
    "personality": "性格",
    "temperament": "脾气",
    "loyalty": "忠诚度",
    "intelligence": "智商",
    "friendliness": "亲人性",
    "energy": "活跃度",
    "careTips": "护理建议",
    "diseases": "常见健康问题",
    "probability": "风险",
    "symptoms": "症状",
    "prevention": "预防"
  },
  "health": {
    "title": "健康百科",
    "subtitle": "了解常见健康问题、护理指南和预防措施。",
    "byBreed": "按品种查看",
    "generalTips": "通用护理建议",
    "sheddingLevels": { "1": "极少", "2": "低", "3": "中等", "4": "高", "5": "极高" }
  },
  "diagnose": {
    "title": "AI宠物诊断",
    "subtitle": "选择症状获取初步健康建议。此工具不能替代专业兽医诊断。",
    "selectType": "选择宠物类型",
    "dog": "狗",
    "cat": "猫",
    "selectSymptoms": "选择症状",
    "results": "可能的状况",
    "disclaimer": "此工具仅供参考。请咨询兽医获取准确诊断。",
    "resultsCount": "根据你的选择，以下是{count}种可能的状况："
  },
  "products": {
    "title": "{breed}推荐用品",
    "bowl": "食盆",
    "leash": "牵引绳",
    "bed": "宠物床",
    "toy": "互动玩具",
    "grooming": "美容套装",
    "food": "优质狗粮",
    "crate": "训练笼",
    "scratch": "猫抓板"
  },
  "common": {
    "back": "返回",
    "viewAll": "查看全部",
    "loading": "加载中...",
    "male": "公",
    "female": "母"
  }
}
```

- [ ] **Step 3: Create middleware**

Create `src/middleware.ts`:
```ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/(en|zh)/:path*"],
};
```

- [ ] **Step 4: Create locale layout**

Create `src/app/[locale]/layout.tsx`:
```tsx
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "en" | "zh")) notFound();

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 5: Update next.config.ts**

```ts
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn2.thedogapi.com" },
      { protocol: "https", hostname: "cdn4.thedogapi.com" },
      { protocol: "https", hostname: "cdn2.thecatapi.com" },
    ],
  },
  trailingSlash: false,
};

export default withNextIntl(nextConfig);
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```
Expected: Successful build, pages generated for both locales.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add i18n with next-intl (EN default, ZH option)"
```

---

### Task 3: Type Definitions and Data Utilities

**Files:**
- Create: `src/types/breed.ts`
- Create: `src/lib/breeds.ts`

- [ ] **Step 1: Create breed types**

Create `src/types/breed.ts`:
```ts
export interface LocalizedString {
  en: string;
  zh: string;
}

export interface LocalizedArray {
  en: string[];
  zh: string[];
}

export interface BreedStats {
  weight: { male: string; female: string };
  height: { male: string; female: string };
  lifespan: LocalizedString;
  coatLength: LocalizedString;
  colors: LocalizedString[];
}

export interface BreedTraits {
  personality: number;
  temperament: number;
  loyalty: number;
  intelligence: number;
  friendliness: number;
  energy: number;
}

export interface BreedDisease {
  name: LocalizedString;
  probability: LocalizedString;
  symptoms: LocalizedArray;
  prevention: LocalizedArray;
}

export interface BreedHealth {
  shedding: LocalizedString;
  sheddingLevel: number;
  diseases: BreedDisease[];
  careTips: LocalizedArray;
}

export interface Breed {
  id: string;
  type: "dog" | "cat";
  name: LocalizedString;
  images: string[];
  origin: LocalizedString;
  history: LocalizedString;
  stats: BreedStats;
  traits: BreedTraits;
  health: BreedHealth;
  tags: LocalizedString[];
}

export type PetType = "dog" | "cat";
export type Locale = "en" | "zh";
```

- [ ] **Step 2: Create data utility**

Create `src/lib/breeds.ts`:
```ts
import fs from "fs";
import path from "path";
import { Breed, PetType } from "@/types/breed";

const DATA_DIR = path.join(process.cwd(), "data", "breeds");

export function loadBreeds(type: PetType): Breed[] {
  const dir = path.join(DATA_DIR, type === "dog" ? "dogs" : "cats");
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    return JSON.parse(raw) as Breed;
  });
}

export function loadBreed(type: PetType, id: string): Breed | null {
  const dir = path.join(DATA_DIR, type === "dog" ? "dogs" : "cats");
  const filePath = path.join(dir, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as Breed;
}

export function getAllBreedIds(): { type: PetType; id: string }[] {
  const result: { type: PetType; id: string }[] = [];
  for (const t of ["dog", "cat"] as PetType[]) {
    const dir = path.join(DATA_DIR, t === "dog" ? "dogs" : "cats");
    if (!fs.existsSync(dir)) continue;
    fs.readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .forEach((f) => result.push({ type: t, id: f.replace(".json", "") }));
  }
  return result;
}

export function searchBreeds(query: string, breeds: Breed[]): Breed[] {
  const q = query.toLowerCase();
  return breeds.filter(
    (b) =>
      b.name.en.toLowerCase().includes(q) ||
      b.name.zh.includes(q) ||
      b.tags.some((t) => t.en.toLowerCase().includes(q))
  );
}
```

- [ ] **Step 3: Verify data loads**

```bash
node -e "const { loadBreeds } = require('./src/lib/breeds.ts');" || npm run build
```
Expected: No build errors from the data loading code.

- [ ] **Step 4: Commit**

```bash
git add src/types/breed.ts src/lib/breeds.ts
git commit -m "feat: add breed types and data loading utilities"
```

---

### Task 4: Header, Footer, and Home Page

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Footer.tsx`
- Create: `src/components/LocaleSwitcher.tsx`
- Create: `src/app/[locale]/page.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create Header component**

Create `src/components/Header.tsx`:
```tsx
import Link from "next/link";
import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Header() {
  const t = useTranslations("nav");

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-amber-600">
          <span className="text-2xl">Paw</span>
          <span className="hidden sm:inline">PetPedia</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm sm:gap-4">
          <Link href="/" className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("home")}</Link>
          <Link href="/breeds/dog" className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("dogs")}</Link>
          <Link href="/breeds/cat" className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("cats")}</Link>
          <Link href="/health" className="rounded-lg px-3 py-2 hover:bg-stone-100 hidden sm:block">{t("health")}</Link>
          <Link href="/diagnose" className="rounded-lg px-3 py-2 hover:bg-stone-100">{t("diagnose")}</Link>
          <LocaleSwitcher />
        </nav>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create LocaleSwitcher**

Create `src/components/LocaleSwitcher.tsx`:
```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const toggleLocale = () => {
    const next = locale === "en" ? "zh" : "en";
    router.replace(pathname, { locale: next });
  };

  return (
    <button onClick={toggleLocale} className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-stone-100">
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
}
```

Note: next-intl `useRouter` and `usePathname` need to be re-exported. Create `src/i18n/routing.ts` updated version:

Add to `src/i18n/routing.ts`:
```ts
export { useRouter, usePathname } from "next-intl/client";
```

But since next-intl v3 doesn't have this, use the navigation helpers instead. Update localeSwitcher to use `useRouter` from `next-intl/client` if available, or use the simpler approach:

Actually, for simplicity, let's use the approach from next-intl docs. Update `LocaleSwitcher.tsx`:
```tsx
"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const next = locale === "en" ? "zh" : "en";
    const newPath = pathname.replace(`/${locale}`, `/${next}`);
    startTransition(() => router.replace(newPath));
  };

  return (
    <button onClick={toggleLocale} disabled={isPending} className="rounded-lg px-2 py-2 text-sm font-medium hover:bg-stone-100 disabled:opacity-50">
      {locale === "en" ? "中文" : "EN"}
    </button>
  );
}
```

- [ ] **Step 3: Create Footer**

Create `src/components/Footer.tsx`:
```tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-stone-500">
        <p> 2026 PetPedia. Data from TheDogAPI & TheCatAPI.</p>
        <p className="mt-1">
          <Link href="/diagnose" className="underline hover:text-stone-700">AI Diagnosis</Link>
          {" "} |{" "}
          <span>Not medical advice. Consult a veterinarian.</span>
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create Home Page**

Create `src/app/[locale]/page.tsx`:
```tsx
import { useTranslations } from "next-intl";
import { loadBreeds } from "@/lib/breeds";
import Link from "next/link";

const features = [
  { key: "traits", icon: "", color: "bg-amber-50 border-amber-200" },
  { key: "health", icon: "", color: "bg-emerald-50 border-emerald-200" },
  { key: "diagnosis", icon: "", color: "bg-blue-50 border-blue-200" },
  { key: "products", icon: "", color: "bg-purple-50 border-purple-200" },
] as const;

export default function HomePage() {
  const t = useTranslations("home");
  const dogs = loadBreeds("dog");
  const cats = loadBreeds("cat");

  return (
    <div>
      <section className="bg-gradient-to-b from-amber-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
            {t("hero")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">{t("subtitle")}</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/breeds/dog"
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-amber-600 transition-colors"
            >
              Paws  {t("exploreDogs")}
            </Link>
            <Link
              href="/breeds/cat"
              className="inline-flex items-center gap-2 rounded-xl bg-stone-800 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-stone-700 transition-colors"
            >
              Paws  {t("exploreCats")}
            </Link>
          </div>
          <div className="mt-8 flex justify-center gap-8 text-sm text-stone-500">
            <span>{t("breedCount", { count: dogs.length })}</span>
            <span>{t("breedCount", { count: cats.length })}</span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.key} className={`rounded-2xl border p-6 ${f.color}`}>
                <h3 className="text-lg font-semibold text-stone-900">
                  {t(`features.${f.key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{t(`features.${f.key}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-stone-900 py-20 text-center text-white">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-bold">Paws  {t("tryDiagnosis")}</h2>
          <p className="mt-4 text-stone-400">Select your pet type and symptoms to get preliminary health insights.</p>
          <Link
            href="/diagnose"
            className="mt-8 inline-block rounded-xl bg-blue-500 px-8 py-4 font-semibold text-white hover:bg-blue-600 transition-colors"
          >
            {t("tryDiagnosis")}
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Create root redirect page**

Create `src/app/page.tsx`:
```tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/en");
}
```

- [ ] **Step 6: Verify build**

```bash
npm run build
```
Expected: Successful build and SSG.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add header, footer, locale switcher, and home page"
```

---

### Task 5: Breed List Page

**Files:**
- Create: `src/components/BreedCard.tsx`
- Create: `src/app/[locale]/breeds/[type]/page.tsx`

- [ ] **Step 1: Create BreedCard component**

Create `src/components/BreedCard.tsx`:
```tsx
import { Breed, Locale } from "@/types/breed";
import Image from "next/image";
import Link from "next/link";

export default function BreedCard({ breed, locale }: { breed: Breed; locale: Locale }) {
  const name = breed.name[locale];
  const imageUrl = breed.images[0] || "";
  const isExternal = imageUrl.startsWith("http");

  return (
    <Link
      href={`/breeds/${breed.type}/${breed.id}`}
      className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {imageUrl ? (
          isExternal ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
          ) : (
            <Image src={imageUrl} alt={name} fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          )
        ) : (
          <div className="flex h-full items-center justify-center text-6xl">{breed.type === "dog" ? "Paws" : "😺"}</div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-stone-700">
          {breed.origin[locale]}
        </span>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-stone-900 group-hover:text-amber-600 transition-colors">{name}</h3>
        <div className="mt-2 flex flex-wrap gap-1">
          {breed.tags.slice(0, 3).map((t, i) => (
            <span key={i} className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-600">
              {t[locale]}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create Breed List Page**

Create `src/app/[locale]/breeds/[type]/page.tsx`:
```tsx
import { loadBreeds, searchBreeds } from "@/lib/breeds";
import { PetType } from "@/types/breed";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import BreedCard from "@/components/BreedCard";
import BreedListClient from "./BreedListClient";

export function generateStaticParams() {
  return [
    { type: "dog", locale: "en" },
    { type: "dog", locale: "zh" },
    { type: "cat", locale: "en" },
    { type: "cat", locale: "zh" },
  ];
}

export default async function BreedListPage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;

  if (type !== "dog" && type !== "cat") notFound();

  const t = await getTranslations("breeds");
  const breeds = loadBreeds(type as PetType);
  const title = type === "dog" ? t("dogs") : t("cats");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900">{title}</h1>
      <p className="mt-2 text-stone-500">{breeds.length} breeds</p>
      <BreedListClient breeds={breeds} locale={locale} type={type as PetType} />
    </div>
  );
}
```

- [ ] **Step 3: Create client search/filter component**

Create `src/app/[locale]/breeds/[type]/BreedListClient.tsx`:
```tsx
"use client";

import { useState } from "react";
import { Breed, Locale, PetType } from "@/types/breed";
import BreedCard from "@/components/BreedCard";
import { searchBreeds } from "@/lib/breeds";

export default function BreedListClient({
  breeds,
  locale,
  type,
}: {
  breeds: Breed[];
  locale: string;
  type: PetType;
}) {
  const [query, setQuery] = useState("");
  const filtered = query ? searchBreeds(query, breeds) : breeds;

  return (
    <>
      <div className="mt-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={locale === "zh" ? "搜索品种名称..." : "Search breed name..."}
          className="w-full rounded-xl border border-stone-300 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 sm:max-w-md"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-stone-500">
          {locale === "zh" ? "未找到匹配的品种。" : "No breeds found matching your search."}
        </p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((breed) => (
            <BreedCard key={breed.id} breed={breed} locale={locale as Locale} />
          ))}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```
Expected: Successful build, list pages generated for both dog and cat for both locales.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add breed card component and list pages with search"
```

---

### Task 6: Breed Detail Page

**Files:**
- Create: `src/components/RadarChartView.tsx`
- Create: `src/components/HealthPanel.tsx`
- Create: `src/components/ProductRecommend.tsx`
- Create: `src/app/[locale]/breeds/[type]/[id]/page.tsx`

- [ ] **Step 1: Create RadarChart component**

Create `src/components/RadarChartView.tsx`:
```tsx
"use client";

import { BreedTraits, Locale } from "@/types/breed";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const traitLabels: Record<keyof BreedTraits, Record<Locale, string>> = {
  personality: { en: "Personality", zh: "性格" },
  temperament: { en: "Temperament", zh: "脾气" },
  loyalty: { en: "Loyalty", zh: "忠诚度" },
  intelligence: { en: "Intelligence", zh: "智商" },
  friendliness: { en: "Friendliness", zh: "亲人性" },
  energy: { en: "Energy", zh: "活跃度" },
};

export default function RadarChartView({ traits, locale }: { traits: BreedTraits; locale: Locale }) {
  const data = Object.entries(traits).map(([key, value]) => ({
    trait: traitLabels[key as keyof BreedTraits]?.[locale] || key,
    value,
  }));

  return (
    <div className="flex justify-center">
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="trait" tick={{ fontSize: 12, fill: "#57534e" }} />
          <Radar
            name="Traits"
            dataKey="value"
            stroke="#d97706"
            fill="#f59e0b"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Create HealthPanel component**

Create `src/components/HealthPanel.tsx`:
```tsx
import { BreedHealth, Locale } from "@/types/breed";

const sheddingBars: Record<number, string> = {
  1: "w-1/5",
  2: "w-2/5",
  3: "w-3/5",
  4: "w-4/5",
  5: "w-full",
};

export default function HealthPanel({ health, locale }: { health: BreedHealth; locale: Locale }) {
  const barWidth = sheddingBars[health.sheddingLevel] || "w-3/5";

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
          {locale === "zh" ? "掉毛程度" : "Shedding Level"}
        </h4>
        <div className="mt-2 flex items-center gap-3">
          <div className="h-3 flex-1 rounded-full bg-stone-200">
            <div className={`h-full rounded-full bg-amber-400 ${barWidth}`} />
          </div>
          <span className="text-sm font-medium text-stone-700">{health.shedding[locale]}</span>
        </div>
      </div>

      {health.diseases.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
            {locale === "zh" ? "常见健康问题" : "Common Health Issues"}
          </h4>
          <ul className="mt-2 space-y-3">
            {health.diseases.map((d, i) => (
              <li key={i} className="rounded-lg border border-stone-200 p-3">
                <p className="font-medium text-stone-800">{d.name[locale]}</p>
                {d.symptoms[locale].length > 0 && (
                  <p className="mt-1 text-xs text-stone-500">
                    {locale === "zh" ? "症状: " : "Symptoms: "}
                    {d.symptoms[locale].join(", ")}
                  </p>
                )}
                {d.prevention[locale].length > 0 && (
                  <p className="mt-1 text-xs text-stone-500">
                    {locale === "zh" ? "预防: " : "Prevention: "}
                    {d.prevention[locale].join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
          {locale === "zh" ? "护理建议" : "Care Tips"}
        </h4>
        <ul className="mt-2 list-disc pl-5 text-sm text-stone-700 space-y-1">
          {health.careTips[locale].map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Create ProductRecommend component**

Create `src/components/ProductRecommend.tsx`:
```tsx
import { Breed, Locale } from "@/types/breed";

const dogProducts = [
  { key: "bowl", icon: "", tags: ["all"] },
  { key: "leash", icon: "", tags: ["all"] },
  { key: "bed", icon: "", tags: ["large", "giant"] },
  { key: "crate", icon: "", tags: ["working", "herding"] },
  { key: "toy", icon: "", tags: ["all"] },
  { key: "grooming", icon: "", tags: ["long coat", "double coat"] },
  { key: "food", icon: "", tags: ["all"] },
];

const catProducts = [
  { key: "bowl", icon: "", tags: ["all"] },
  { key: "scratch", icon: "", tags: ["all"] },
  { key: "bed", icon: "", tags: ["all"] },
  { key: "toy", icon: "", tags: ["all"] },
  { key: "grooming", icon: "", tags: ["long coat"] },
  { key: "food", icon: "", tags: ["all"] },
];

const productLabels: Record<string, Record<Locale, string>> = {
  bowl: { en: "Premium Food Bowl", zh: "优质食盆" },
  leash: { en: "Durable Leash Set", zh: "耐用牵引绳套装" },
  bed: { en: "Comfort Pet Bed", zh: "舒适宠物床" },
  crate: { en: "Training Crate", zh: "训练笼" },
  toy: { en: "Interactive Toy", zh: "互动玩具" },
  grooming: { en: "Grooming Kit", zh: "美容套装" },
  food: { en: "Premium Pet Food", zh: "优质宠物粮" },
  scratch: { en: "Scratching Post", zh: "猫抓板" },
};

const productPrices: Record<string, { en: string; zh: string }> = {
  bowl: { en: "$12.99", zh: "89" },
  leash: { en: "$19.99", zh: "139" },
  bed: { en: "$34.99", zh: "249" },
  crate: { en: "$49.99", zh: "349" },
  toy: { en: "$9.99", zh: "69" },
  grooming: { en: "$24.99", zh: "179" },
  food: { en: "$29.99", zh: "209" },
  scratch: { en: "$15.99", zh: "109" },
};

export default function ProductRecommend({ breed, locale }: { breed: Breed; locale: Locale }) {
  const products = breed.type === "dog" ? dogProducts : catProducts;
  const breedTags = breed.tags.map((t) => t.en.toLowerCase());
  const breedName = breed.name[locale];

  const relevant = products.filter((p) => {
    if (p.tags.includes("all")) return true;
    return p.tags.some((tag) => breedTags.some((bt) => bt.includes(tag)));
  });

  if (relevant.length === 0) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {relevant.map((product) => (
        <div key={product.key} className="rounded-xl border border-stone-200 bg-white p-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl">
            {product.icon || (breed.type === "dog" ? "Paws" : "😺")}
          </div>
          <p className="mt-3 text-sm font-medium text-stone-800">{productLabels[product.key]?.[locale] || product.key}</p>
          <p className="mt-1 text-xs text-stone-500">{locale === "zh" ? "适合" : "For"} {breedName}</p>
          <p className="mt-2 text-lg font-bold text-amber-600">{productPrices[product.key]?.[locale]}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create Breed Detail Page**

Create `src/app/[locale]/breeds/[type]/[id]/page.tsx`:
```tsx
import { loadBreed, getAllBreedIds } from "@/lib/breeds";
import { PetType, Locale } from "@/types/breed";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import RadarChartView from "@/components/RadarChartView";
import HealthPanel from "@/components/HealthPanel";
import ProductRecommend from "@/components/ProductRecommend";

export function generateStaticParams() {
  return getAllBreedIds().flatMap(({ type, id }) => [
    { type, id, locale: "en" },
    { type, id, locale: "zh" },
  ]);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string; id: string }>;
}): Promise<Metadata> {
  const { locale, type, id } = await params;
  const breed = loadBreed(type as PetType, id);
  if (!breed) return { title: "Not Found" };

  return {
    title: `${breed.name[locale as Locale]} | PetPedia`,
    description: `${breed.history[locale as Locale]?.slice(0, 150)}...`,
    openGraph: {
      title: breed.name[locale as Locale],
      description: breed.history[locale as Locale]?.slice(0, 150),
      images: breed.images[0] ? [{ url: breed.images[0] }] : [],
    },
  };
}

export default async function BreedDetailPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; id: string }>;
}) {
  const { locale, type, id } = await params;

  if (type !== "dog" && type !== "cat") notFound();

  const breed = loadBreed(type as PetType, id);
  if (!breed) notFound();

  const t = await getTranslations("detail");
  const l = locale as Locale;
  const imageUrl = breed.images[0] || "";
  const isExternal = imageUrl.startsWith("http");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <Link href={`/breeds/${type}`} className="text-sm text-amber-600 hover:underline">
        &larr; {type === "dog" ? (locale === "zh" ? "所有狗品种" : "All Dog Breeds") : (locale === "zh" ? "所有猫品种" : "All Cat Breeds")}
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl bg-stone-100">
          {imageUrl ? (
            isExternal ? (
              <img src={imageUrl} alt={breed.name[l]} className="h-80 w-full object-cover" />
            ) : (
              <Image src={imageUrl} alt={breed.name[l]} width={600} height={400} className="h-80 w-full object-cover" priority />
            )
          ) : (
            <div className="flex h-80 items-center justify-center text-8xl">{type === "dog" ? "Paws" : "😺"}</div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-stone-900">{breed.name[l]}</h1>
          <p className="mt-1 text-sm text-stone-500">{breed.origin[l]}</p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-stone-50 p-3">
              <p className="text-xs text-stone-500">{locale === "zh" ? "体重" : "Weight"}</p>
              <p className="font-medium">{breed.stats.weight.male}</p>
              <p className="text-xs text-stone-400">{breed.stats.weight.female}</p>
            </div>
            <div className="rounded-lg bg-stone-50 p-3">
              <p className="text-xs text-stone-500">{locale === "zh" ? "寿命" : "Lifespan"}</p>
              <p className="font-medium">{breed.stats.lifespan[l]}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            {breed.tags.slice(0, 5).map((tag, i) => (
              <span key={i} className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-700">
                {tag[l]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-stone-900">{t("history")}</h2>
        <div className="mt-4 rounded-xl border border-stone-200 bg-white p-6">
          <p className="leading-relaxed text-stone-700">{breed.history[l] || (l === "zh" ? "暂无历史资料。" : "No history available.")}</p>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-stone-900">{t("traits")}</h2>
        <div className="mt-4 rounded-xl border border-stone-200 bg-white p-6">
          <RadarChartView traits={breed.traits} locale={l} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-stone-900">{t("health")}</h2>
        <div className="mt-4 rounded-xl border border-stone-200 bg-white p-6">
          <HealthPanel health={breed.health} locale={l} />
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-bold text-stone-900">{t("products")}</h2>
        <div className="mt-4">
          <ProductRecommend breed={breed} locale={l} />
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Verify build**

```bash
npm run build
```
Expected: Successful build generating 500+ static pages (266 breeds x 2 locales + list pages).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add breed detail page with radar chart, health panel, and product recommendations"
```

---

### Task 7: Health Encyclopedia Page

**Files:**
- Create: `src/app/[locale]/health/page.tsx`

- [ ] **Step 1: Create Health Page**

Create `src/app/[locale]/health/page.tsx`:
```tsx
import { loadBreeds } from "@/lib/breeds";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

const generalTips = {
  en: [
    { title: "Regular Checkups", desc: "Schedule annual veterinary visits for vaccinations and health screening." },
    { title: "Balanced Diet", desc: "Provide age-appropriate, high-quality pet food. Avoid toxic human foods." },
    { title: "Exercise", desc: "Ensure daily physical activity appropriate for your pet's breed and age." },
    { title: "Dental Care", desc: "Brush teeth regularly and provide dental treats to prevent oral disease." },
    { title: "Grooming", desc: "Regular brushing, nail trimming, and bathing based on coat type." },
    { title: "Hydration", desc: "Always provide fresh, clean water. Monitor intake for changes." },
  ],
  zh: [
    { title: "定期检查", desc: "每年安排兽医检查，确保疫苗接种和健康筛查。" },
    { title: "均衡饮食", desc: "提供适合年龄的优质宠物食品，避免有害的人类食物。" },
    { title: "适当运动", desc: "根据宠物品种和年龄，确保每天有足够的运动量。" },
    { title: "口腔护理", desc: "定期刷牙并提供洁齿零食，预防口腔疾病。" },
    { title: "梳理美容", desc: "根据毛发类型定期梳理、修剪指甲和洗澡。" },
    { title: "充足饮水", desc: "随时提供新鲜干净的水，注意饮水量的变化。" },
  ],
};

export default async function HealthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("health");
  const dogs = loadBreeds("dog");
  const cats = loadBreeds("cat");
  const tips = generalTips[locale as "en" | "zh"];
  const isZh = locale === "zh";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-2 text-stone-500">{t("subtitle")}</p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-stone-900">{isZh ? "通用护理建议" : "General Care Tips"}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip, i) => (
            <div key={i} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <h3 className="font-semibold text-emerald-800">{tip.title}</h3>
              <p className="mt-1 text-sm text-emerald-700">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-bold text-stone-900">
          {isZh ? "按品种查看健康信息" : "Health Info by Breed"}
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/breeds/dog"
            className="rounded-xl border border-stone-200 bg-white p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-4xl">Paws</p>
            <h3 className="mt-3 text-lg font-semibold">
              {isZh ? `狗品种 (${dogs.length})` : `Dog Breeds (${dogs.length})`}
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              {isZh ? "查看所有狗品种的健康信息" : "View health info for all dog breeds"}
            </p>
          </Link>
          <Link
            href="/breeds/cat"
            className="rounded-xl border border-stone-200 bg-white p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-4xl">😺</p>
            <h3 className="mt-3 text-lg font-semibold">
              {isZh ? `猫品种 (${cats.length})` : `Cat Breeds (${cats.length})`}
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              {isZh ? "查看所有猫品种的健康信息" : "View health info for all cat breeds"}
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Successful build.

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/health/page.tsx
git commit -m "feat: add health encyclopedia page"
```

---

### Task 8: AI Diagnosis Page (Static FAQ)

**Files:**
- Create: `src/lib/diagnosis.ts`
- Create: `src/app/[locale]/diagnose/page.tsx`

- [ ] **Step 1: Create diagnosis matching logic**

Create `src/lib/diagnosis.ts`:
```ts
export interface SymptomCategory {
  id: string;
  en: string;
  zh: string;
  symptoms: { id: string; en: string; zh: string }[];
}

export interface DiagnosisResult {
  name: { en: string; zh: string };
  probability: { en: string; zh: string };
  description: { en: string; zh: string };
  actions: { en: string[]; zh: string[] };
}

const symptomCategories: SymptomCategory[] = [
  {
    id: "skin",
    en: "Skin & Coat",
    zh: "皮肤与被毛",
    symptoms: [
      { id: "itching", en: "Itching / Scratching", zh: "瘙痒/抓挠" },
      { id: "hair-loss", en: "Hair Loss", zh: "脱毛" },
      { id: "rash", en: "Rash / Redness", zh: "皮疹/发红" },
      { id: "dandruff", en: "Dandruff", zh: "皮屑" },
    ],
  },
  {
    id: "digestive",
    en: "Digestive",
    zh: "消化系统",
    symptoms: [
      { id: "vomiting", en: "Vomiting", zh: "呕吐" },
      { id: "diarrhea", en: "Diarrhea", zh: "腹泻" },
      { id: "appetite-loss", en: "Loss of Appetite", zh: "食欲不振" },
      { id: "constipation", en: "Constipation", zh: "便秘" },
    ],
  },
  {
    id: "respiratory",
    en: "Respiratory",
    zh: "呼吸系统",
    symptoms: [
      { id: "coughing", en: "Coughing", zh: "咳嗽" },
      { id: "sneezing", en: "Sneezing", zh: "打喷嚏" },
      { id: "nasal-discharge", en: "Nasal Discharge", zh: "流鼻涕" },
      { id: "breathing-difficulty", en: "Breathing Difficulty", zh: "呼吸困难" },
    ],
  },
  {
    id: "behavior",
    en: "Behavior",
    zh: "行为",
    symptoms: [
      { id: "lethargy", en: "Lethargy / Fatigue", zh: "嗜睡/疲劳" },
      { id: "aggression", en: "Sudden Aggression", zh: "突然攻击性" },
      { id: "anxiety", en: "Anxiety / Restlessness", zh: "焦虑/不安" },
      { id: "excessive-barking", en: "Excessive Barking/Vocalization", zh: "过度吠叫" },
    ],
  },
  {
    id: "mobility",
    en: "Mobility",
    zh: "行动",
    symptoms: [
      { id: "limping", en: "Limping", zh: "跛行" },
      { id: "stiffness", en: "Joint Stiffness", zh: "关节僵硬" },
      { id: "difficulty-standing", en: "Difficulty Standing", zh: "站立困难" },
    ],
  },
  {
    id: "eyes-ears",
    en: "Eyes & Ears",
    zh: "眼睛与耳朵",
    symptoms: [
      { id: "eye-discharge", en: "Eye Discharge", zh: "眼部分泌物" },
      { id: "ear-scratching", en: "Ear Scratching", zh: "耳朵抓挠" },
      { id: "red-eyes", en: "Red Eyes", zh: "眼睛发红" },
      { id: "head-shaking", en: "Head Shaking", zh: "摇头" },
    ],
  },
];

const diagnosisMap: Record<string, DiagnosisResult[]> = {
  "itching+hair-loss": [
    { name: { en: "Allergic Dermatitis", zh: "过敏性皮炎" }, probability: { en: "High", zh: "高" }, description: { en: "Common allergic reaction to food, environment, or fleas.", zh: "对食物、环境或跳蚤的常见过敏反应。" }, actions: { en: ["Identify and remove allergen", "Consult vet for antihistamines", "Use hypoallergenic shampoo"], zh: ["识别并移除过敏原", "咨询兽医使用抗组胺药", "使用低敏洗发水"] } },
    { name: { en: "Mange (Mites)", zh: "疥癣（螨虫）" }, probability: { en: "Medium", zh: "中" }, description: { en: "Parasitic mites causing intense itching and hair loss.", zh: "寄生螨虫引起剧烈瘙痒和脱毛。" }, actions: { en: ["Veterinary skin scraping", "Prescription antiparasitic medication", "Clean bedding thoroughly"], zh: ["兽医皮肤刮片检查", "处方抗寄生虫药物", "彻底清洁寝具"] } },
  ],
  "vomiting+appetite-loss": [
    { name: { en: "Gastritis", zh: "胃炎" }, probability: { en: "High", zh: "高" }, description: { en: "Inflammation of stomach lining, often from dietary indiscretion.", zh: "胃黏膜炎症，通常由饮食不当引起。" }, actions: { en: ["Withhold food for 12-24 hours", "Provide small amounts of water", "Introduce bland diet gradually"], zh: ["禁食12-24小时", "少量多次喂水", "逐步引入清淡饮食"] } },
    { name: { en: "Foreign Body Ingestion", zh: "异物吞入" }, probability: { en: "Medium", zh: "中" }, description: { en: "Pet may have swallowed a non-food object causing obstruction.", zh: "宠物可能吞入了非食物物品导致堵塞。" }, actions: { en: ["Seek emergency veterinary care", "Do not induce vomiting without vet guidance", "X-ray may be required"], zh: ["紧急就医", "勿在兽医指导外催吐", "可能需要X光检查"] } },
  ],
  "coughing+sneezing+nasal-discharge": [
    { name: { en: "Kennel Cough / Upper Respiratory Infection", zh: "犬窝咳/上呼吸道感染" }, probability: { en: "High", zh: "高" }, description: { en: "Highly contagious respiratory infection common in multi-pet environments.", zh: "在多宠物环境中常见的高度传染性呼吸道感染。" }, actions: { en: ["Isolate from other pets", "Keep warm and rested", "Veterinary check for antibiotics if needed"], zh: ["与其他宠物隔离", "保暖休息", "兽医检查是否需要抗生素"] } },
  ],
  "lethargy+appetite-loss": [
    { name: { en: "Systemic Infection", zh: "全身性感染" }, probability: { en: "High", zh: "高" }, description: { en: "Various infections can cause general malaise and appetite loss.", zh: "各种感染可能导致全身不适和食欲下降。" }, actions: { en: ["Veterinary examination required", "Blood work may be needed", "Monitor temperature"], zh: ["需要兽医检查", "可能需要血液检查", "监测体温"] } },
    { name: { en: "Kidney Disease", zh: "肾脏疾病" }, probability: { en: "Medium (older pets)", zh: "中（老年宠物）" }, description: { en: "Gradual decline in kidney function, common in senior pets.", zh: "肾功能逐渐下降，常见于老年宠物。" }, actions: { en: ["Immediate veterinary consultation", "Blood and urine tests", "Special renal diet"], zh: ["立即咨询兽医", "血液和尿液检查", "特殊肾脏饮食"] } },
  ],
  "limping+stiffness": [
    { name: { en: "Arthritis / Joint Pain", zh: "关节炎/关节痛" }, probability: { en: "High", zh: "高" }, description: { en: "Inflammation of joints causing pain and reduced mobility.", zh: "关节炎症导致疼痛和行动不便。" }, actions: { en: ["Weight management", "Joint supplements (glucosamine)", "Low-impact exercise"], zh: ["体重管理", "关节补充剂（葡萄糖胺）", "低冲击运动"] } },
    { name: { en: "Hip Dysplasia", zh: "髋关节发育不良" }, probability: { en: "Medium (large breeds)", zh: "中（大型犬）" }, description: { en: "Hereditary condition where hip joint doesn't fit properly.", zh: "遗传性疾病，髋关节不能正常契合。" }, actions: { en: ["Veterinary orthopedic evaluation", "Weight management", "Physical therapy"], zh: ["兽医骨科评估", "体重管理", "物理治疗"] } },
  ],
  "eye-discharge+red-eyes": [
    { name: { en: "Conjunctivitis (Pink Eye)", zh: "结膜炎（红眼病）" }, probability: { en: "High", zh: "高" }, description: { en: "Inflammation of the eye's outer membrane, caused by allergies or infection.", zh: "眼外膜炎症，由过敏或感染引起。" }, actions: { en: ["Keep eye area clean", "Avoid irritants", "Veterinary eye drops may be needed"], zh: ["保持眼部清洁", "避免刺激物", "可能需要兽医眼药水"] } },
  ],
};

export function getDiagnosisResult(symptomIds: string[]): DiagnosisResult[] {
  const key = [...symptomIds].sort().join("+");

  const exact = diagnosisMap[key];
  if (exact) return exact;

  for (const [pattern, results] of Object.entries(diagnosisMap)) {
    const patternIds = pattern.split("+");
    const overlap = patternIds.filter((id) => symptomIds.includes(id));
    if (overlap.length >= Math.min(2, patternIds.length)) {
      return results;
    }
  }

  const allSymptoms = symptomCategories.flatMap((c) => c.symptoms.map((s) => s.id));
  if (symptomIds.some((id) => allSymptoms.includes(id))) {
    return [
      {
        name: { en: "General Health Concern", zh: "综合健康问题" },
        probability: { en: "Uncertain", zh: "不确定" },
        description: { en: "Your selected symptoms indicate a need for professional evaluation.", zh: "你选择的症状表明需要专业评估。" },
        actions: { en: ["Schedule a veterinary checkup", "Monitor symptoms closely", "Keep a symptom diary"], zh: ["预约兽医检查", "密切观察症状", "记录症状日记"] },
      },
    ];
  }

  return [];
}

export function getSymptomCategories(): SymptomCategory[] {
  return symptomCategories;
}
```

- [ ] **Step 2: Create Diagnosis page**

Create `src/app/[locale]/diagnose/page.tsx`:
```tsx
"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { getSymptomCategories, getDiagnosisResult, type DiagnosisResult } from "@/lib/diagnosis";

export default function DiagnosePage() {
  const t = useTranslations("diagnose");
  const locale = useLocale();
  const isZh = locale === "zh";
  const [petType, setPetType] = useState<"dog" | "cat" | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [results, setResults] = useState<DiagnosisResult[]>([]);

  const categories = getSymptomCategories();

  const toggleSymptom = (id: string) => {
    const next = new Set(selectedSymptoms);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedSymptoms(next);
  };

  const handleDiagnose = () => {
    const result = getDiagnosisResult(Array.from(selectedSymptoms));
    setResults(result);

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "diagnosis", petType, symptoms: Array.from(selectedSymptoms) }),
    }).catch(() => {});
  };

  const handleReset = () => {
    setPetType(null);
    setSelectedSymptoms(new Set());
    setResults([]);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900">{t("title")}</h1>
      <p className="mt-2 text-stone-500">{t("subtitle")}</p>

      {/* Step 1: Pet Type */}
      {!petType && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold">{t("selectType")}</h2>
          <div className="mt-4 flex gap-4">
            <button onClick={() => setPetType("dog")} className="flex-1 rounded-2xl border-2 border-stone-200 p-8 text-center hover:border-amber-400 transition-colors">
              <p className="text-5xl">Paws</p>
              <p className="mt-3 text-lg font-semibold">{t("dog")}</p>
            </button>
            <button onClick={() => setPetType("cat")} className="flex-1 rounded-2xl border-2 border-stone-200 p-8 text-center hover:border-amber-400 transition-colors">
              <p className="text-5xl">😺</p>
              <p className="mt-3 text-lg font-semibold">{t("cat")}</p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Symptoms */}
      {petType && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{petType === "dog" ? (isZh ? "犬" : "Dog") : (isZh ? "猫" : "Cat")} — {t("selectSymptoms")}</h2>
            <button onClick={handleReset} className="text-sm text-stone-400 underline">{isZh ? "重新开始" : "Start over"}</button>
          </div>

          <div className="mt-4 space-y-6">
            {categories.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-sm font-medium text-stone-500 uppercase tracking-wide">
                  {isZh ? cat.zh : cat.en}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {cat.symptoms.map((s) => {
                    const selected = selectedSymptoms.has(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSymptom(s.id)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                          selected
                            ? "bg-amber-500 text-white shadow"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {isZh ? s.zh : s.en}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleDiagnose}
            disabled={selectedSymptoms.size === 0}
            className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isZh ? "开始诊断" : "Start Diagnosis"}
          </button>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h2 className="text-xl font-bold text-blue-900">
            {isZh ? "诊断建议" : "Diagnosis Suggestions"}
          </h2>
          <p className="mt-1 text-sm text-blue-700">
            {isZh
              ? `根据你的选择，以下是${results.length}种可能的状况：`
              : `Based on your selections, here are ${results.length} possible conditions:`}
          </p>

          <div className="mt-4 space-y-4">
            {results.map((r, i) => (
              <div key={i} className="rounded-xl bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-stone-800">{isZh ? r.name.zh : r.name.en}</h3>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {isZh ? r.probability.zh : r.probability.en} {isZh ? "可能性" : "Probability"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-stone-600">{isZh ? r.description.zh : r.description.en}</p>
                <div className="mt-3">
                  <p className="text-xs font-medium text-stone-500 uppercase">{isZh ? "建议行动" : "Recommended Actions"}:</p>
                  <ul className="mt-1 list-disc pl-5 text-sm text-stone-700">
                    {(isZh ? r.actions.zh : r.actions.en).map((a, j) => (
                      <li key={j}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-stone-400">{t("disclaimer")}</p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```
Expected: Successful build.

- [ ] **Step 3: Commit**

```bash
git add src/lib/diagnosis.ts src/app/\[locale\]/diagnose/page.tsx
git commit -m "feat: add static FAQ diagnosis page with symptom-based matching"
```

---

### Task 9: API Routes (Diagnosis Proxy + Analytics)

**Files:**
- Create: `src/app/api/diagnose/route.ts`
- Create: `src/app/api/analytics/route.ts`

- [ ] **Step 1: Create diagnosis API proxy**

Create `src/app/api/diagnose/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";
import { getDiagnosisResult } from "@/lib/diagnosis";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symptoms, type } = body;

    if (!Array.isArray(symptoms)) {
      return NextResponse.json({ error: "symptoms array required" }, { status: 400 });
    }

    const results = getDiagnosisResult(symptoms);

    // ready for OpenAI migration:
    // const aiResults = await callOpenAI(symptoms, type);
    // return NextResponse.json({ results: aiResults });

    return NextResponse.json({ results, type: type || "unknown" });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create analytics API**

Create `src/app/api/analytics/route.ts`:
```ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, petType, symptoms } = body;

    // ready for production analytics (e.g., Vercel Analytics, PostHog, etc.)
    console.log("[analytics]", new Date().toISOString(), event, petType, symptoms?.length);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Successful build, API routes included.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/
git commit -m "feat: add diagnosis API proxy and analytics endpoint"
```

---

### Task 10: SEO, Sitemap, and Final Polish

**Files:**
- Create: `src/app/[locale]/sitemap.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create sitemap**

Create `src/app/[locale]/sitemap.ts`:
```ts
import { getAllBreedIds } from "@/lib/breeds";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://petpedia.vercel.app";
  const locales = ["en", "zh"];
  const breeds = getAllBreedIds();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({ url: `${baseUrl}/${locale}`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 });
    entries.push({ url: `${baseUrl}/${locale}/breeds/dog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 });
    entries.push({ url: `${baseUrl}/${locale}/breeds/cat`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 });
    entries.push({ url: `${baseUrl}/${locale}/health`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 });
    entries.push({ url: `${baseUrl}/${locale}/diagnose`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 });

    for (const breed of breeds) {
      entries.push({
        url: `${baseUrl}/${locale}/breeds/${breed.type}/${breed.id}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
```

- [ ] **Step 2: Update root metadata**

Replace the root `src/app/layout.tsx` metadata section:
```tsx
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://petpedia.vercel.app"),
  title: {
    default: "PetPedia — AI Pet Breed Encyclopedia",
    template: "%s | PetPedia",
  },
  description: "Explore 266+ dog and cat breeds with radar charts, health guides, AI diagnosis, and product picks. Bilingual EN/ZH.",
  openGraph: {
    title: "PetPedia — AI Pet Breed Encyclopedia",
    description: "Explore 266+ dog and cat breeds with radar charts, health guides, and AI diagnosis.",
    siteName: "PetPedia",
    type: "website",
  },
  robots: "index, follow",
};
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```
Expected: Successful build.

- [ ] **Step 4: Dev server test**

```bash
npm run dev
```
Expected: Server starts on http://localhost:3000. Browse the site and verify all pages work.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, SEO metadata, and final polish"
```

---

### Task 11: Vercel Deployment

- [ ] **Step 1: Push to GitHub**

```bash
git add -A
git status
```

Review the status. Then commit if anything is pending.

Create a GitHub repo and push:
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

- [ ] **Step 2: Import to Vercel**

Go to https://vercel.com/new and import the GitHub repo. Vercel auto-detects Next.js — no configuration needed.

- [ ] **Step 3: Set environment variables (if needed)**

None needed for MVP. For future AI integration: `OPENAI_API_KEY`.

- [ ] **Step 4: Deploy**

Click "Deploy" in Vercel. First build takes 3-5 minutes (500+ static pages).

- [ ] **Step 5: Verify**

Browse the deployed URL. Check:
- Home page loads
- Breed list (`/en/breeds/dog`, `/zh/breeds/cat`)
- Breed detail (click any breed)
- Radar chart renders
- Health page
- Diagnosis page — select pet type + symptoms → see results
- Locale switcher works
- Mobile responsive

---

## Post-MVP (v2)

- Replace static diagnosis with OpenAI API (`POST /api/diagnose` reads `OPENAI_API_KEY`)
- Add Vercel Analytics for real metrics
- Fill Chinese translations for breed names & history
- Add image optimization (Next.js Image with remotePatterns)
- Add breed comparison tool
- Monetization: affiliate links in product recommendations