import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import DiagnosePageClient from "./DiagnosePageClient"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const l = locale as "en" | "zh"
  const title = l === "en" ? "AI Pet Health Diagnosis" : "AI宠物健康诊断"
  const description = l === "en"
    ? "Select symptoms and get preliminary health analysis for your dog or cat. Powered by AI."
    : "选择症状，获取狗狗或猫咪的初步AI健康分析。"
  return {
    title: `${title} - PetPedia`,
    description,
    openGraph: { title: `${title} - PetPedia`, description },
  }
}

export default async function DiagnosePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations("diagnose")

  return (
    <DiagnosePageClient
      locale={locale}
      stepType={t("stepType")}
      stepSymptoms={t("stepSymptoms")}
      stepResult={t("stepResult")}
      dog={t("dog")}
      cat={t("cat")}
      selectSymptomsHint={t("selectSymptomsHint")}
      startDiagnosis={t("startDiagnosis")}
      restart={t("restart")}
      diagnosisSuggestions={t("diagnosisSuggestions")}
      resultsBasedOn={t("resultsBasedOn")}
      probability={t("probability")}
      recommendedActions={t("recommendedActions")}
      noResults={t("noResults")}
    />
  )
}