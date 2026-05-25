export interface SymptomCategory {
  id: string
  en: string
  zh: string
  symptoms: { id: string; en: string; zh: string }[]
}

export interface DiagnosisResult {
  name: { en: string; zh: string }
  probability: { en: string; zh: string }
  description: { en: string; zh: string }
  actions: { en: string[]; zh: string[] }
}

const symptomCategories: SymptomCategory[] = [
  {
    id: "skin", en: "Skin & Coat", zh: "皮肤与被毛",
    symptoms: [
      { id: "itching", en: "Itching / Scratching", zh: "瘙痒/抓挠" },
      { id: "hair-loss", en: "Hair Loss", zh: "脱毛" },
      { id: "rash", en: "Rash / Redness", zh: "皮疹/发红" },
      { id: "dandruff", en: "Dandruff", zh: "皮屑" },
    ],
  },
  {
    id: "digestive", en: "Digestive", zh: "消化系统",
    symptoms: [
      { id: "vomiting", en: "Vomiting", zh: "呕吐" },
      { id: "diarrhea", en: "Diarrhea", zh: "腹泻" },
      { id: "appetite-loss", en: "Loss of Appetite", zh: "食欲不振" },
      { id: "constipation", en: "Constipation", zh: "便秘" },
    ],
  },
  {
    id: "respiratory", en: "Respiratory", zh: "呼吸系统",
    symptoms: [
      { id: "coughing", en: "Coughing", zh: "咳嗽" },
      { id: "sneezing", en: "Sneezing", zh: "打喷嚏" },
      { id: "nasal-discharge", en: "Nasal Discharge", zh: "流鼻涕" },
      { id: "breathing-difficulty", en: "Breathing Difficulty", zh: "呼吸困难" },
    ],
  },
  {
    id: "behavior", en: "Behavior", zh: "行为",
    symptoms: [
      { id: "lethargy", en: "Lethargy / Fatigue", zh: "嗜睡/疲劳" },
      { id: "aggression", en: "Sudden Aggression", zh: "突然攻击性" },
      { id: "anxiety", en: "Anxiety / Restlessness", zh: "焦虑/不安" },
      { id: "excessive-barking", en: "Excessive Barking/Vocalization", zh: "过度吠叫" },
    ],
  },
  {
    id: "mobility", en: "Mobility", zh: "行动",
    symptoms: [
      { id: "limping", en: "Limping", zh: "跛行" },
      { id: "stiffness", en: "Joint Stiffness", zh: "关节僵硬" },
      { id: "difficulty-standing", en: "Difficulty Standing", zh: "站立困难" },
    ],
  },
  {
    id: "eyes-ears", en: "Eyes & Ears", zh: "眼睛与耳朵",
    symptoms: [
      { id: "eye-discharge", en: "Eye Discharge", zh: "眼部分泌物" },
      { id: "ear-scratching", en: "Ear Scratching", zh: "耳朵抓挠" },
      { id: "red-eyes", en: "Red Eyes", zh: "眼睛发红" },
      { id: "head-shaking", en: "Head Shaking", zh: "摇头" },
    ],
  },
]

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
    { name: { en: "Kennel Cough / URI", zh: "犬窝咳/上呼吸道感染" }, probability: { en: "High", zh: "高" }, description: { en: "Highly contagious respiratory infection common in multi-pet environments.", zh: "在多宠物环境中常见的高度传染性呼吸道感染。" }, actions: { en: ["Isolate from other pets", "Keep warm and rested", "Veterinary check for antibiotics if needed"], zh: ["与其他宠物隔离", "保暖休息", "兽医检查是否需要抗生素"] } },
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
}

export function getDiagnosisResult(symptomIds: string[]): DiagnosisResult[] {
  if (symptomIds.length === 0) return []
  const key = [...symptomIds].sort().join("+")
  const exact = diagnosisMap[key]
  if (exact) return exact
  for (const [pattern, results] of Object.entries(diagnosisMap)) {
    const patternIds = pattern.split("+")
    const overlap = patternIds.filter((id) => symptomIds.includes(id))
    if (overlap.length >= Math.min(2, patternIds.length)) return results
  }
  return [{ name: { en: "General Health Concern", zh: "综合健康问题" }, probability: { en: "Uncertain", zh: "不确定" }, description: { en: "Your selected symptoms indicate a need for professional evaluation.", zh: "你选择的症状表明需要专业评估。" }, actions: { en: ["Schedule a veterinary checkup", "Monitor symptoms closely", "Keep a symptom diary"], zh: ["预约兽医检查", "密切观察症状", "记录症状日记"] } }]
}

export function getSymptomCategories(): SymptomCategory[] {
  return symptomCategories
}