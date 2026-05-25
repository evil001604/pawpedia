import { getTranslations } from "next-intl/server"
import DiagnosePageClient from "./DiagnosePageClient"

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