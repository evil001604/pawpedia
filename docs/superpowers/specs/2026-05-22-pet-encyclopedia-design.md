# AI 宠物大百科 — 设计规格说明书

> 日期：2026-05-22 | 状态：已确认

---

## 1. 项目概述

一个面向宠物爱好者的 AI 宠物百科平台。用户可浏览猫、狗全品种的详细信息（性格、智商、健康等），使用 AI 辅助的宠物症状诊断功能，并获取相关宠物用品推荐。

- **平台**：Web（移动端优先，响应式）
- **目标用户**：海外用户为主，默认英文，支持切换中文
- **部署**：Vercel（Hobby 计划，零成本）
- **MVP 目标**：验证用户对宠物百科 + AI 诊断的需求，积累内容与用户行为数据

---

## 2. 核心功能（MVP）

### 2.1 品种列表页
- 按动物类型（狗/猫）分类展示
- 支持搜索（品种名模糊匹配）
- 支持筛选（体型、掉毛程度、智商等级等）
- 卡片式展示：品种图片 + 名称 + 关键标签

### 2.2 品种详情页
- **雷达图**：性格、脾气、忠诚度、智商、亲人性、活跃度（多维度可视化）
- **品种由来**：历史起源故事卡片
- **健康信息**：掉毛程度、常见疾病列表、平均寿命、护理难度
- **快速数据面板**：体型、体重范围、毛色、原产地
- 图片轮播（多个品种代表图片）

### 2.3 健康百科
- 以品种为单位展示健康数据
- 常见疾病详情（症状、预防、治疗建议）
- 护理指南（饮食、运动、美容）

### 2.4 AI 宠物诊断（MVP 为静态 FAQ）
- 用户选择宠物类型 → 选择症状分类 → 选择具体症状
- 系统基于关键词匹配返回可能的疾病和建议
- **埋点统计**：记录每次诊断请求，积累需求数据
- **预留接口**：API Route `POST /api/diagnose`，后续无缝切换至 OpenAI

### 2.5 宠物用品推荐
- 在详情页底部根据品种特性推荐相关用品（狗绳、狗屋、狗粮等）
- 基于标签匹配（大型犬 → 大型狗屋 / 掉毛 → 除毛梳）
- MVP 阶段为静态推荐数据，后期可接入联盟营销（淘宝客等）

---

## 3. 数据架构

### 3.1 品种数据结构（JSON Schema）

```json
{
  "id": "golden-retriever",
  "type": "dog",
  "name": { "en": "Golden Retriever", "zh": "金毛寻回犬" },
  "images": ["/images/breeds/golden-retriever-1.jpg"],
  "origin": { "en": "Scotland, United Kingdom", "zh": "英国苏格兰" },
  "history": {
    "en": "The Golden Retriever originated in the Scottish Highlands in the late 19th century...",
    "zh": "金毛寻回犬起源于19世纪末的苏格兰高地..."
  },
  "stats": {
    "weight": { "male": "29-34kg", "female": "25-29kg" },
    "height": { "male": "56-61cm", "female": "51-56cm" },
    "lifespan": { "en": "10-12 years", "zh": "10-12年" },
    "coatLength": { "en": "Long", "zh": "长毛" },
    "colors": [
      { "en": "Golden", "zh": "金色" },
      { "en": "Light Golden", "zh": "浅金色" },
      { "en": "Cream", "zh": "奶油色" }
    ]
  },
  "traits": {
    "personality": 90,
    "temperament": 85,
    "loyalty": 88,
    "intelligence": 92,
    "friendliness": 95,
    "energy": 80
  },
  "health": {
    "shedding": { "en": "High", "zh": "高" },
    "sheddingLevel": 4,
    "diseases": [
      {
        "name": { "en": "Hip Dysplasia", "zh": "髋关节发育不良" },
        "probability": { "en": "Medium", "zh": "中" },
        "symptoms": {
          "en": ["Lameness", "Reduced activity"],
          "zh": ["跛行", "活动减少"]
        },
        "prevention": {
          "en": ["Weight control", "Moderate exercise"],
          "zh": ["控制体重", "适量运动"]
        }
      }
    ],
    "careTips": {
      "en": ["Brush 2-3 times per week", "At least 1 hour exercise daily"],
      "zh": ["每周梳理2-3次", "每天至少1小时运动"]
    }
  },
  "tags": [
    { "en": "Family Dog", "zh": "家庭犬" },
    { "en": "Guide Dog", "zh": "导盲犬" },
    { "en": "Friendly", "zh": "友善" },
    { "en": "High Energy", "zh": "运动量大" }
  ]
}
```

### 3.2 数据来源
- 百度百科、维基百科（品种基本信息、历史）
- 波奇网、爱宠网（健康数据、护理指南）
- AKC 犬种数据库、CFA 猫种数据库（品种标准）
- Unsplash、Wikimedia（品种图片）
- 目标覆盖：狗 200+ 品种，猫 40+ 品种

### 3.3 数据流

```
爬虫脚本 → 原始数据 → normalize 脚本 → data/breeds/*.json
                                              ↓
                                    Next.js SSG 构建时读取
                                              ↓
                                    静态 HTML 页面（/breeds/[id]）
```

---

## 4. 技术架构

### 4.1 技术栈

| 层 | 技术 | 说明 |
|---|------|------|
| 框架 | Next.js 15 (App Router) | Vercel 原生支持 |
| 样式 | Tailwind CSS 4 | 原子化 CSS，快速开发 |
| i18n | next-intl | 国际化，默认英文，支持中文切换 |
| 图表 | Recharts | 雷达图等可视化组件 |
| 数据 | 静态 JSON | 构建时读取，零运行时成本 |
| 部署 | Vercel | Hobby 免费计划 |
| 爬虫 | Node.js + cheerio + axios | 本地运行的数据采集脚本 |
| 埋点 | Vercel Analytics / 自定义 API | 记录用户行为 |

### 4.2 目录结构

```
pets/
├── data/
│   └── breeds/
│       ├── dogs/           # 狗品种 JSON
│       └── cats/           # 猫品种 JSON
├── public/
│   └── images/
│       └── breeds/         # 品种图片（本地存储）
├── scripts/
│   └── scraper/
│       ├── dogs.ts         # 狗品种爬虫
│       ├── cats.ts         # 猫品种爬虫
│       ├── images.ts       # 图片下载
│       └── normalize.ts    # 数据标准化
├── src/
│   ├── app/
│   │   ├── layout.tsx      # 根布局
│   │   ├── page.tsx        # 首页
│   │   ├── breeds/
│   │   │   ├── [type]/     # /breeds/dog | /breeds/cat
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/   # /breeds/dog/golden-retriever
│   │   │   │       └── page.tsx
│   │   ├── health/         # 健康百科
│   │   ├── diagnose/       # AI 诊断页
│   │   └── api/
│   │       ├── diagnose/   # 诊断 API Route（预留）
│   │       └── analytics/  # 埋点 API Route
│   ├── components/
│   │   ├── BreedCard.tsx
│   │   ├── RadarChart.tsx
│   │   ├── HealthPanel.tsx
│   │   ├── DiagnosisWizard.tsx
│   │   └── ProductRecommend.tsx
│   ├── lib/
│   │   ├── breeds.ts       # 品种数据读取工具
│   │   └── diagnosis.ts    # 诊断匹配逻辑
│   └── types/
│       └── breed.ts        # TypeScript 类型定义
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-22-pet-encyclopedia-design.md
├── .superpowers/           # 脑暴辅助文件（gitignore）
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 4.3 页面路由规划

| 路由 | 页面 | 渲染方式 |
|------|------|----------|
| `/` | 重定向至 `/en` | Redirect |
| `/[locale]` | 首页（分类入口 + 搜索） | SSG |
| `/[locale]/breeds/dog` | 狗品种列表 | SSG |
| `/[locale]/breeds/cat` | 猫品种列表 | SSG |
| `/[locale]/breeds/dog/[id]` | 狗品种详情 | SSG |
| `/[locale]/breeds/cat/[id]` | 猫品种详情 | SSG |
| `/[locale]/health` | 健康百科首页 | SSG |
| `/[locale]/diagnose` | AI 宠物诊断 | 客户端组件 |
| `/api/diagnose` | 诊断 API（预留） | API Route |
| `/api/analytics` | 埋点 API | API Route |

---

## 5. MVP 开发计划

### Phase 0：数据准备 & UI 设计（3-5 天）

| 任务 | 产出 |
|------|------|
| 编写爬虫脚本 | 自动采集多源品种数据 |
| 采集狗品种 200+ | `data/breeds/dogs/*.json` |
| 采集猫品种 40+ | `data/breeds/cats/*.json` |
| 下载品种图片 | `public/images/breeds/` |
| 数据标准化 | 统一 JSON Schema |
| UI 视觉稿定稿 | 首页 / 列表 / 详情 / 诊断 布局确认 |

### Phase 1：核心页面（5-7 天）

| 任务 | 产出 |
|------|------|
| Next.js 项目初始化 | 框架搭建 + Tailwind 配置 |
| 类型定义 + 数据工具 | `types/breed.ts` + `lib/breeds.ts` |
| 首页 | 分类导航 + 搜索入口 |
| 品种列表页 | 卡片网格 + 搜索 + 筛选 |
| 品种详情页 | 雷达图 + 信息面板 + 历史卡片 |
| 图片轮播组件 | 品种大图展示 |

### Phase 2：功能模块（5-7 天）

| 任务 | 产出 |
|------|------|
| 健康百科模块 | 疾病列表 + 护理指南 |
| 静态诊断 FAQ | 症状选择 → 匹配 → 建议 |
| 用品推荐模块 | 标签匹配推荐 |
| 埋点系统 | 诊断请求计数 + 页面浏览 |
| API Route 预留 | `/api/diagnose` + `/api/analytics` |

### Phase 3：收尾上线（2-3 天）

| 任务 | 产出 |
|------|------|
| SEO 优化 | metadata + sitemap + og-image |
| 响应式适配 | 移动端 / 平板 / 桌面 |
| 性能优化 | Lighthouse 检查 |
| Vercel 部署 | 域名配置 + 上线 |
| 测试 | 全页面走查 |

---

## 6. 非功能需求

### 6.1 性能
- 首页 Lighthouse Performance > 90
- 品种详情页 LCP < 2.5s
- 图片全部 WebP + 懒加载

### 6.2 SEO
- 每个品种详情页动态生成 title / description / og:image
- 自动生成 sitemap.xml
- 结构化数据（Schema.org / Breed）

### 6.3 响应式
- 移动端优先设计
- 列表页：手机 1 列 → 平板 2 列 → 桌面 3-4 列

---

## 7. 风险与边界

| 风险 | 应对 |
|------|------|
| 爬虫被封 IP | 加延迟 + User-Agent 轮换 |
| 品种数据不准确 | AI 生成后人工抽检 |
| 图片存储过大 | 统一压缩至 200KB/张以下 |
| 诊断功能误判 | 加免责声明 + 建议就医 |
| Vercel Hobby 限制 | 单个文件 10MB 以下，函数执行 10s 超时 |

---

## 8. 后续迭代方向

1. **接入 OpenAI**：诊断 API 从关键词匹配升级为大模型
2. **用户系统**：收藏品种、诊断历史记录
3. **社区功能**：用户评论、晒宠、经验分享
4. **品类扩展**：兔子、仓鼠、鸟类、爬行动物
5. **联盟营销**：对接淘宝客 / 京东联盟，用品推荐变现
6. **CMS 后台**：内容管理独立于代码仓库