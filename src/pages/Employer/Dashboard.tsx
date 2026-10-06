import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import Skeleton, {
  SkeletonStatCards,
} from "@/components/ui/skeleton/Skeleton";
import { useCompanyJobsList, useMyCompany } from "@/hooks/useEmployer";
import { isApiError } from "@/lib/http";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function EmployerDashboard() {
  const { t } = useTranslation();
  const companyQuery = useMyCompany();
  const company = companyQuery.data;

  // 404 = belum onboarding; 403 ditoleransi untuk kompatibilitas backend lama.
  const companyMissing = isApiError(companyQuery.error, 404, 403);

  const draftQuery = useCompanyJobsList(company?.id, "DRAFT", 1);
  const publishedQuery = useCompanyJobsList(company?.id, "PUBLISHED", 1);
  const archivedQuery = useCompanyJobsList(company?.id, "ARCHIVED", 1);

  const stats = [
    {
      label: t("employer.dashboard.draftJobs"),
      value: draftQuery.data?.meta.total ?? 0,
      path: "/employer/jobs",
    },
    {
      label: t("employer.dashboard.publishedJobs"),
      value: publishedQuery.data?.meta.total ?? 0,
      path: "/employer/jobs",
    },
    {
      label: t("employer.dashboard.archivedJobs"),
      value: archivedQuery.data?.meta.total ?? 0,
      path: "/employer/jobs",
    },
  ];

  const statsLoading =
    companyQuery.isPending ||
    (company !== undefined &&
      (draftQuery.isPending ||
        publishedQuery.isPending ||
        archivedQuery.isPending));

  return (
    <>
      <PageMeta
        title={t("employer.dashboard.metaTitle")}
        description={t("employer.dashboard.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("employer.dashboard.title")} />

      {companyMissing ? (
        <div className="mb-6 rounded-2xl border border-warning-200 bg-warning-50 p-5 dark:border-warning-500/30 dark:bg-warning-500/10">
          <p className="text-theme-sm text-warning-700 dark:text-warning-400">
            {t("employer.dashboard.companyMissing")}
          </p>
          <Link
            to="/employer/company"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-warning-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-warning-600"
          >
            {t("employer.dashboard.createCompany")}
          </Link>
        </div>
      ) : null}

      {companyQuery.isPending ? (
        <Skeleton className="mb-6 h-20 rounded-2xl" />
      ) : company ? (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3">
          <p className="text-base font-semibold text-gray-800 dark:text-white/90">
            {company.name}
          </p>
          <p className="mt-0.5 text-theme-sm text-gray-500 dark:text-gray-400">
            {t("employer.dashboard.signedInAs", {
              role: t(`employer.roles.${company.membership.companyRole}`),
            })}
          </p>
        </div>
      ) : null}

      {statsLoading ? (
        <SkeletonStatCards />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.path}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
            >
              <p className="text-title-sm font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/employer/jobs/new"
          className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
        >
          <p className="text-base font-semibold text-gray-800 dark:text-white/90">
            {t("employer.dashboard.postJob")}
          </p>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            {t("employer.dashboard.postJobHint")}
          </p>
        </Link>

        <Link
          to="/employer/members"
          className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
        >
          <p className="text-base font-semibold text-gray-800 dark:text-white/90">
            {t("employer.dashboard.manageMembers")}
          </p>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            {t("employer.dashboard.manageMembersHint")}
          </p>
        </Link>
      </div>
    </>
  );
}
