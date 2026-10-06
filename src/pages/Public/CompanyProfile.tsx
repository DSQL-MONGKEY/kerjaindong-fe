import PageMeta from "@/components/common/PageMeta";
import JobCard from "@/components/jobs/JobCard";
import FollowCompanyButton from "@/components/seeker/FollowCompanyButton";
import { usePublicCompany, usePublicJobs } from "@/hooks/useJobs";
import { formatDate } from "@/utils/format";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

export default function CompanyProfile() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const companyQuery = usePublicCompany(slug);
  const company = companyQuery.data;

  const jobsQuery = usePublicJobs(
    { companyId: company?.id },
    { enabled: Boolean(company?.id), limit: 6 },
  );
  const jobs = jobsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  if (companyQuery.isPending) {
    return (
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 py-10 md:px-6">
        <div className="h-48 animate-pulse rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/3" />
      </div>
    );
  }

  if (companyQuery.isError || !company) {
    return (
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 py-16 text-center md:px-6">
        <h1 className="text-title-sm font-bold text-gray-900 dark:text-white">
          {t("company.notFound")}
        </h1>
        <Link
          to="/jobs"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white transition hover:bg-brand-600"
        >
          {t("jobs.heading")}
        </Link>
      </div>
    );
  }

  const locationText = [company.location.city?.name, company.location.province?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <PageMeta
        title={`${company.name} | Kerjaindong`}
        description={
          company.description?.slice(0, 155) ??
          t("company.metaDescription", { name: company.name })
        }
      />

      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 py-10 md:px-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand-50 text-2xl font-bold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                {company.name.charAt(0).toUpperCase()}
              </span>
              <div>
                <h1 className="text-title-sm font-bold text-gray-900 dark:text-white">
                  {company.name}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-theme-sm text-gray-500 dark:text-gray-400">
                  {company.industry ? <span>{company.industry}</span> : null}
                  {locationText ? <span>{locationText}</span> : null}
                  {company.verification === "VERIFIED" ? (
                    <span className="font-medium text-success-600 dark:text-success-400">
                      {t("company.verified")}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            {company.website ? (
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
              >
                {t("company.website")}
              </a>
            ) : null}

            <FollowCompanyButton companyId={company.id} />
          </div>

          {company.description ? (
            <p className="mt-5 text-theme-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
              {company.description}
            </p>
          ) : null}

          <p className="mt-4 text-theme-xs text-gray-400 dark:text-gray-500">
            {t("company.joinedAt", { date: formatDate(company.createdAt) })}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-white">
            {t("company.jobs")}
          </h2>

          {jobsQuery.isPending ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/3"
                />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
              <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                {t("company.noJobs")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
