import { Breed } from '@/types/breed'

export interface ScoreProfile {
  energyBias: number
  sizeBias: number
  groomingBias: number
  friendlinessBias: number
  trainabilityBias: number
  sheddingBias: number
  adaptabilityBias: number
  healthBias: number
}

export interface QuizOption {
  id: string
  optionEn: string
  optionZh: string
  scoreProfile: Partial<ScoreProfile>
}

export interface Question {
  id: string
  category: string
  questionEn: string
  questionZh: string
  options: QuizOption[]
  weight: number
}

export interface QuizAnswer {
  questionId: string
  optionId: string
}

export interface QuizResult {
  breed: Breed
  matchScore: number
  matchReasons: string[]
}

export const QUESTIONS: Question[] = [
  {
    id: 'living_space',
    category: 'environment',
    questionEn: 'What is your living situation?',
    questionZh: '您的居住环境是？',
    weight: 1.5,
    options: [
      {
        id: 'apartment_small',
        optionEn: 'Small apartment (no yard)',
        optionZh: '小公寓（无院子）',
        scoreProfile: { sizeBias: -4, adaptabilityBias: 3, energyBias: -2 }
      },
      {
        id: 'apartment_large',
        optionEn: 'Large apartment (no yard)',
        optionZh: '大公寓（无院子）',
        scoreProfile: { sizeBias: -2, adaptabilityBias: 2, energyBias: -1 }
      },
      {
        id: 'house_yard',
        optionEn: 'House with small yard',
        optionZh: '带小院子的房子',
        scoreProfile: { sizeBias: 0, adaptabilityBias: 1, energyBias: 1 }
      },
      {
        id: 'house_large_yard',
        optionEn: 'House with large yard/farm',
        optionZh: '带大院子/农场的房子',
        scoreProfile: { sizeBias: 3, energyBias: 3, adaptabilityBias: 0 }
      }
    ]
  },
  {
    id: 'time_availability',
    category: 'commitment',
    questionEn: 'How much time can you dedicate daily to your pet?',
    questionZh: '您每天能花多少时间陪伴宠物？',
    weight: 1.5,
    options: [
      {
        id: 'time_1hr',
        optionEn: 'Less than 1 hour',
        optionZh: '少于1小时',
        scoreProfile: { energyBias: -4, groomingBias: -3, trainabilityBias: 2 }
      },
      {
        id: 'time_2hr',
        optionEn: '1-2 hours',
        optionZh: '1-2小时',
        scoreProfile: { energyBias: -2, groomingBias: -1, trainabilityBias: 1 }
      },
      {
        id: 'time_3hr',
        optionEn: '2-3 hours',
        optionZh: '2-3小时',
        scoreProfile: { energyBias: 0, groomingBias: 0, trainabilityBias: 0 }
      },
      {
        id: 'time_4hr_plus',
        optionEn: '3+ hours',
        optionZh: '3小时以上',
        scoreProfile: { energyBias: 3, groomingBias: 2, trainabilityBias: 1 }
      }
    ]
  },
  {
    id: 'experience',
    category: 'experience',
    questionEn: 'What is your experience level with pets?',
    questionZh: '您的养宠经验如何？',
    weight: 1.2,
    options: [
      {
        id: 'exp_first_time',
        optionEn: 'First-time owner',
        optionZh: '首次养宠',
        scoreProfile: { trainabilityBias: 4, friendlinessBias: 3, adaptabilityBias: 3, healthBias: 2 }
      },
      {
        id: 'exp_some',
        optionEn: 'Some experience (grew up with pets)',
        optionZh: '有一定经验（家里养过宠物）',
        scoreProfile: { trainabilityBias: 2, friendlinessBias: 1, adaptabilityBias: 1 }
      },
      {
        id: 'exp_experienced',
        optionEn: 'Experienced owner',
        optionZh: '有丰富经验',
        scoreProfile: { trainabilityBias: 0, friendlinessBias: 0, adaptabilityBias: 0 }
      },
      {
        id: 'exp_expert',
        optionEn: 'Expert/trainer level',
        optionZh: '专家/训练师级别',
        scoreProfile: { trainabilityBias: -2, energyBias: 2, sizeBias: 1 }
      }
    ]
  },
  {
    id: 'activity_preference',
    category: 'lifestyle',
    questionEn: 'What activity level do you prefer in a pet?',
    questionZh: '您希望宠物的活跃程度？',
    weight: 1.3,
    options: [
      {
        id: 'activity_couch',
        optionEn: 'Couch potato (calm, low-energy)',
        optionZh: '宅家伴侣（安静、低能量）',
        scoreProfile: { energyBias: -5, sizeBias: -1, adaptabilityBias: 2 }
      },
      {
        id: 'activity_moderate',
        optionEn: 'Moderate (daily walks OK)',
        optionZh: '适中（可以每天散步）',
        scoreProfile: { energyBias: 0, adaptabilityBias: 1 }
      },
      {
        id: 'activity_active',
        optionEn: 'Active (running, hiking, playing)',
        optionZh: '活跃（跑步、远足、玩耍）',
        scoreProfile: { energyBias: 4, sizeBias: 1, trainabilityBias: 1 }
      },
      {
        id: 'activity_very_active',
        optionEn: 'Very active (sports, working dog)',
        optionZh: '非常活跃（运动型、工作犬）',
        scoreProfile: { energyBias: 5, sizeBias: 2, trainabilityBias: 2 }
      }
    ]
  },
  {
    id: 'allergy',
    category: 'health',
    questionEn: 'Does anyone in your household have pet allergies?',
    questionZh: '家里有人对宠物过敏吗？',
    weight: 1.4,
    options: [
      {
        id: 'allergy_severe',
        optionEn: 'Yes, severe allergies',
        optionZh: '是的，严重过敏',
        scoreProfile: { sheddingBias: -5, groomingBias: -3 }
      },
      {
        id: 'allergy_mild',
        optionEn: 'Yes, mild allergies',
        optionZh: '是的，轻微过敏',
        scoreProfile: { sheddingBias: -3, groomingBias: -2 }
      },
      {
        id: 'allergy_unsure',
        optionEn: 'Not sure',
        optionZh: '不确定',
        scoreProfile: { sheddingBias: -1, groomingBias: -1 }
      },
      {
        id: 'allergy_none',
        optionEn: 'No allergies',
        optionZh: '不过敏',
        scoreProfile: { sheddingBias: 0, groomingBias: 0 }
      }
    ]
  },
  {
    id: 'family',
    category: 'social',
    questionEn: 'Who lives in your household?',
    questionZh: '您的家庭成员构成是？',
    weight: 1.0,
    options: [
      {
        id: 'family_solo',
        optionEn: 'Live alone',
        optionZh: '独居',
        scoreProfile: { friendlinessBias: -1, adaptabilityBias: 2 }
      },
      {
        id: 'family_couple',
        optionEn: 'Couple only',
        optionZh: '情侣/夫妻',
        scoreProfile: { friendlinessBias: 0, adaptabilityBias: 1 }
      },
      {
        id: 'family_kids',
        optionEn: 'Family with young children (under 10)',
        optionZh: '有小孩的家庭（10岁以下）',
        scoreProfile: { friendlinessBias: 4, sizeBias: -1, trainabilityBias: 2, energyBias: 1 }
      },
      {
        id: 'family_mixed',
        optionEn: 'Multi-generational (kids + elderly)',
        optionZh: '多代同堂（老人小孩都有）',
        scoreProfile: { friendlinessBias: 3, sizeBias: -2, energyBias: -2, adaptabilityBias: 2 }
      }
    ]
  },
  {
    id: 'noise_tolerance',
    category: 'environment',
    questionEn: 'How much noise/vocalization can you tolerate?',
    questionZh: '您能容忍多大的噪音/叫声？',
    weight: 0.8,
    options: [
      {
        id: 'noise_quiet',
        optionEn: 'Need very quiet (apartment, noise-sensitive)',
        optionZh: '需要非常安静（公寓、对噪音敏感）',
        scoreProfile: { energyBias: -2, sizeBias: -1, adaptabilityBias: 2 }
      },
      {
        id: 'noise_moderate',
        optionEn: 'Moderate OK (occasional barking/meowing)',
        optionZh: '适中（偶尔叫唤可以接受）',
        scoreProfile: { adaptabilityBias: 1 }
      },
      {
        id: 'noise_tolerant',
        optionEn: 'Tolerant (house with space)',
        optionZh: '包容性强（房子空间大）',
        scoreProfile: { energyBias: 1, sizeBias: 1 }
      }
    ]
  },
  {
    id: 'grooming_willingness',
    category: 'care',
    questionEn: 'How much grooming are you willing to do?',
    questionZh: '您愿意花多少精力打理宠物？',
    weight: 1.1,
    options: [
      {
        id: 'groom_minimal',
        optionEn: 'Minimal (brush occasionally)',
        optionZh: '极少（偶尔梳毛）',
        scoreProfile: { groomingBias: -5, sheddingBias: -3 }
      },
      {
        id: 'groom_low',
        optionEn: 'Low (weekly brushing)',
        optionZh: '较低（每周梳毛）',
        scoreProfile: { groomingBias: -2, sheddingBias: -1 }
      },
      {
        id: 'groom_moderate',
        optionEn: 'Moderate (2-3x per week)',
        optionZh: '适中（每周2-3次）',
        scoreProfile: { groomingBias: 0, sheddingBias: 0 }
      },
      {
        id: 'groom_high',
        optionEn: 'High (daily grooming, professional grooming OK)',
        optionZh: '较高（每日打理，可以接受专业美容）',
        scoreProfile: { groomingBias: 4, sheddingBias: 2 }
      }
    ]
  },
  {
    id: 'budget',
    category: 'practical',
    questionEn: 'What is your monthly budget for pet care?',
    questionZh: '您每月的养宠预算是多少？',
    weight: 0.9,
    options: [
      {
        id: 'budget_low',
        optionEn: 'Budget-conscious ($50-100/month)',
        optionZh: '经济型（$50-100/月）',
        scoreProfile: { sizeBias: -3, groomingBias: -2, healthBias: 2 }
      },
      {
        id: 'budget_medium',
        optionEn: 'Moderate ($100-200/month)',
        optionZh: '中等（$100-200/月）',
        scoreProfile: { sizeBias: 0, groomingBias: 0, healthBias: 1 }
      },
      {
        id: 'budget_high',
        optionEn: 'Flexible ($200-400/month)',
        optionZh: '宽裕（$200-400/月）',
        scoreProfile: { sizeBias: 2, groomingBias: 2, healthBias: 0 }
      },
      {
        id: 'budget_premium',
        optionEn: 'Premium ($400+/month, no limits)',
        optionZh: '高端（$400+/月，不限预算）',
        scoreProfile: { sizeBias: 3, groomingBias: 3, healthBias: -1 }
      }
    ]
  },
  {
    id: 'purpose',
    category: 'lifestyle',
    questionEn: 'What is your primary purpose for getting a pet?',
    questionZh: '您养宠的主要目的是什么？',
    weight: 1.2,
    options: [
      {
        id: 'purpose_companion',
        optionEn: 'Companion/emotional support',
        optionZh: '陪伴/情感支持',
        scoreProfile: { friendlinessBias: 4, energyBias: -1, adaptabilityBias: 2, sizeBias: -1 }
      },
      {
        id: 'purpose_family_pet',
        optionEn: 'Family pet (play with kids)',
        optionZh: '家庭宠物（陪孩子玩）',
        scoreProfile: { friendlinessBias: 4, energyBias: 2, sizeBias: 0, trainabilityBias: 2 }
      },
      {
        id: 'purpose_guard',
        optionEn: 'Watch/guard dog',
        optionZh: '看家/护卫',
        scoreProfile: { sizeBias: 3, energyBias: 2, trainabilityBias: 2, friendlinessBias: -2 }
      },
      {
        id: 'purpose_show_sport',
        optionEn: 'Show/breeding/sports',
        optionZh: '展览/繁殖/运动比赛',
        scoreProfile: { groomingBias: 3, trainabilityBias: 3, energyBias: 2, sizeBias: 1 }
      }
    ]
  }
]

function extractAvgWeight(weight: { male: string; female: string }): number {
  const extract = (s: string): number => {
    const match = s.match(/(\d+)/)
    return match ? parseInt(match[1]) : 25
  }
  return (extract(weight.male) + extract(weight.female)) / 2
}

function normalize(value: number): number {
  return (value - 5.5) * 2
}

function getBreedScoreProfile(breed: Breed): ScoreProfile {
  const traits = breed.traits
  const health = breed.health
  const avgWeight = extractAvgWeight(breed.stats.weight)

  return {
    energyBias: normalize(traits.energy),
    sizeBias: normalize(avgWeight / 5),
    groomingBias: normalize(health.sheddingLevel || 5),
    friendlinessBias: normalize(traits.friendliness),
    trainabilityBias: normalize((traits.intelligence + traits.loyalty) / 2),
    sheddingBias: normalize(health.sheddingLevel || 5),
    adaptabilityBias: normalize(traits.temperament),
    healthBias: normalize(10 - (health.diseases?.length || 0) * 0.5)
  }
}

function calculateMatchScore(
  breedProfile: ScoreProfile,
  answerProfiles: Array<{ profile: Partial<ScoreProfile>; weight: number }>
): number {
  const keys: (keyof ScoreProfile)[] = [
    'energyBias', 'sizeBias', 'groomingBias', 'friendlinessBias',
    'trainabilityBias', 'sheddingBias', 'adaptabilityBias', 'healthBias'
  ]

  let totalScore = 0
  let totalWeight = 0

  answerProfiles.forEach(({ profile, weight }) => {
    let questionScore = 0

    keys.forEach((key) => {
      if (profile[key] === undefined) return
      const userPref = profile[key]!
      const breedVal = breedProfile[key]
      const difference = Math.abs(userPref - breedVal)
      const similarity = Math.max(0, 10 - difference)
      questionScore += similarity
    })

    const definedKeys = keys.filter(k => profile[k] !== undefined).length
    const normalizedScore = definedKeys > 0 ? questionScore / definedKeys : 5

    totalScore += normalizedScore * weight
    totalWeight += weight
  })

  return totalWeight > 0 ? (totalScore / totalWeight) / 10 * 100 : 50
}

function generateMatchReasons(breed: Breed, profile: ScoreProfile): string[] {
  const reasons: string[] = []

  if (profile.energyBias >= 3) reasons.push('energy_high')
  else if (profile.energyBias <= -3) reasons.push('energy_low')
  if (profile.friendlinessBias >= 3) reasons.push('friendly')
  if (profile.trainabilityBias >= 3) reasons.push('trainable')
  if (profile.groomingBias <= -3) reasons.push('low_grooming')
  if (profile.sizeBias <= -3) reasons.push('compact_size')
  if (profile.adaptabilityBias >= 3) reasons.push('adaptable')
  if (profile.healthBias >= 3) reasons.push('healthy')

  return reasons.slice(0, 4)
}

export function matchBreeds(
  answers: QuizAnswer[],
  breeds: Breed[],
  petType: 'dog' | 'cat'
): QuizResult[] {
  const filteredBreeds = breeds.filter(b => b.type === petType)

  const answerProfiles = answers.map(answer => {
    const question = QUESTIONS.find(q => q.id === answer.questionId)
    const option = question?.options.find(o => o.id === answer.optionId)
    return {
      profile: option?.scoreProfile || {} as Partial<ScoreProfile>,
      weight: question?.weight || 1
    }
  })

  const scoredBreeds = filteredBreeds.map(breed => {
    const breedProfile = getBreedScoreProfile(breed)
    const matchScore = calculateMatchScore(breedProfile, answerProfiles)
    const matchReasons = generateMatchReasons(breed, breedProfile)

    return {
      breed,
      matchScore: Math.round(matchScore * 10) / 10,
      matchReasons
    }
  })

  return scoredBreeds
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3)
}