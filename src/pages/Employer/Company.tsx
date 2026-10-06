import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { SkeletonForm } from "@/components/ui/skeleton/Skeleton";
import CompanyForm from "@/components/employer/CompanyForm";
import { useMyCompany } from "@/hooks/useEmployer";
import { isApiError } from "@/lib/http";
import { useTranslation } from "react-i18next";

export default function EmployerCompanyPage() {
  const { t } = useTranslation();
  const companyQuery = useMyCompany();

  // 404 = belum onboarding; 403 ditoleransi untuk kompatibilitas backend lama.
  const companyMissing = isApiError(companyQuery.error, 404, 403);

  return (
    <>
      <PageMeta
        title={t("employer.company.metaTitle")}
        description={t("employer.company.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("employer.company.title")} />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        {companyQuery.isPending ? (
          <SkeletonForm fields={5} />
        ) : companyQuery.isError && !companyMissing ? (
          <div className="rounded-xl border border-error-200 bg-error-50 p-4 text-theme-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {t("errors.generic")}
          </div>
        ) : (
          <CompanyForm
            company={companyMissing ? null : (companyQuery.data ?? null)}
          />
        )}
      </div>
    </>
  );
}
