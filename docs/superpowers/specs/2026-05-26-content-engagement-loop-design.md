# Content Engagement Loop Design

> **Goal:** 在品种详情页、Quiz 结果页、对比页底部增加内链织网，形成内容闭环，延长用户停留时间以提升广告流量收入。

## Overview

在每个"内容出口"页面底部增加相似品种推荐和跨页面 CTA，让用户自然地在页面间跳转，告别"看完就走"的局面。

## Components

### 1. `src/lib/similarity.ts` — 相似品种匹配算法

纯服务端函数，基于 breed.tags 重叠度匹配：

```
1. 过滤同物种所有品种
2. 对每个品种计算 tag 重叠数
3. 排除自身，按重叠数降序
4. 取前 N 个（不足则随机补齐）
```

### 2. `src/components/SimilarBreeds.tsx` — 复用卡片展示组件

接收 `breeds: Breed[]` 数组，渲染 4 列卡片网格。每卡片：图片 → 名称 → 产地 → 跳转详情页链接。

## Page Modifications

### 3. 品种详情页 (`breeds/[type]/[id]/page.tsx`)

在 ChatPanel 上方新增两个区域：
- **Compare CTA 横条**: "Want to see how {Breed} stacks up?" → 跳转 `/compare`
- **SimilarBreeds 区域**: 基于当前品种展示 4 个相似品种

最终布局：品种信息 → 雷达图 → 健康 → 产品 → AI诊断CTA → **Compare CTA** → **SimilarBreeds** → ChatPanel

### 4. Quiz 结果页 (`QuizResult.tsx`)

在现有 Top 3 + 按钮下方新增：
- **物种切换**: "Not your match?" → [Try Dogs] [Try Cats] 切换重测
- **SimilarBreeds**: 基于 Top 1 品种展示相似品种
- **浏览全部**: "Browse all breeds →" 链接到品种列表

### 5. 对比页 (`CompareView.tsx`)

在对比结果下方新增：
- **SimilarBreeds**: 基于 breedA 展示相似品种
- **Quiz CTA**: "Find your perfect match" → [Take the Quiz →]

## File Changes Summary

| File | Action |
|------|--------|
| `src/lib/similarity.ts` | **New** |
| `src/components/SimilarBreeds.tsx` | **New** |
| `src/app/[locale]/breeds/[type]/[id]/page.tsx` | Modify |
| `src/components/QuizResult.tsx` | Modify |
| `src/components/CompareView.tsx` | Modify |
| `src/messages/en.json` | Modify |
| `src/messages/zh.json` | Modify |

No new routes. No new infrastructure. ~200 lines of code.