import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import { SkeletonListCard } from "@/components/ui/skeleton/Skeleton";
import JobStatusActions from "@/components/employer/JobStatusActions";
import { JobStatusBadge } from "@/components/employer/StatusBadges";
import { useCompanyJobsList, useMyCompany } from "@/hooks/useEmployer";
import type { JobStatus } from "@/lib/employer-types";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const statuses: JobStatus[] = [
  "DRAFT",
  "PUBLISHED",
  "PAUSED",
  "CLOSED",
  "ARCHIVED",
];

export default function EmployerJobsPage() {
  const { t } = useTranslation();
  const companyQuery = useMyCompany();
  const [status, setStatus] = useState<JobStatus | "">("");
  const [page, setPage] = useState(1);

  const jobsQuery = useCompanyJobsList(companyQuery.data?.id, status, page);
  const jobs = jobsQuery.data?.items ?? [];
  const meta = jobsQuery.data?.meta;

  if (companyQuery.isPending) {
    return <SkeletonListCard rows={3} />;
  }

  if (!companyQuery.data) {
    return (
      <>
        <PageMeta
          title={t("employer.jobs.metaTitle")}
          description={t("employer.jobs.metaDescription")}
        />
        <PageBreadCrumb pageTitle={t("employer.jobs.title")} />
        <div className="rounded-2xl border border-warning-200 bg-warning-50 p-6 dark:border-warning-500/30 dark:bg-warning-500/10">
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
      </>
    );
  }

  return (
    <>
      <PageMeta
        title={t("employer.jobs.metaTitle")}
        description={t("employer.jobs.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("employer.jobs.title")} />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setStatus("");
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-theme-xs font-medium transition ${
              status === ""
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300"
            }`}
          >
            {t("employer.jobs.allStatuses")}
          </button>
          {statuses.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
              className={`rounded-full px-4 py-2 text-theme-xs font-medium transition ${
                status === item
                  ? "bg-brand-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300"
              }`}
            >
              {t(`employer.jobs.status.${item}`)}
            </button>
          ))}
        </div>

        <Link
          to="/employer/jobs/new"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-theme-sm font-medium text-white transition hover:bg-brand-600"
        >
          {t("employer.jobs.create")}
        </Link>
      </div>

      {jobsQuery.isPending ? (
        <SkeletonListCard rows={3} />
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("employer.jobs.empty")}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        {job.title}
                      </h3>
                      <JobStatusBadge status={job.status} />
                    </div>
                    <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                      {t("employer.jobs.meta", {
                        applications: job.applicationCount,
                        views: job.viewCount,
                        date: formatDate(job.publishedAt ?? job.createdAt),
                      })}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/employer/jobs/${job.id}/applicants`}
                      className="rounded-lg border border-gray-300 px-3 py-2 text-theme-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                    >
                      {t("employer.jobs.viewApplicants")}
                    </Link>
                    {job.status !== "ARCHIVED" ? (
                      <Link
                        to={`/employer/jobs/${job.id}/edit`}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-theme-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                      >
                        {t("common.edit")}
                      </Link>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4">
                  <JobStatusActions jobId={job.id} status={job.status} />
                </div>
              </div>
            ))}
          </div>

          {meta ? (
            <SimplePagination
              page={meta.page}
              totalPages={meta.totalPages}
              onChange={setPage}
            />
          ) : null}
        </>
      )}
    </>
  );
}
