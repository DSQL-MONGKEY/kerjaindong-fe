import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import ApplicationStatusBadge from "@/components/seeker/ApplicationStatusBadge";
import { useMyApplications } from "@/hooks/useApplications";
import type { ApplicationStatus } from "@/lib/seeker-types";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

const statuses: ApplicationStatus[] = [
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

export default function SeekerApplicationsPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [page, setPage] = useState(1);

  const query = useMyApplications(status || undefined, page);
  const applications = query.data?.items ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <PageMeta
        title={t("seeker.applications.metaTitle")}
        description={t("seeker.applications.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("seeker.applications.title")} />

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setStatus("");
            setPage(1);
          }}
          className={`rounded-full px-4 py-2 text-theme-xs font-medium transition ${
            status === ""
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
          }`}
        >
          {t("seeker.applications.allStatuses")}
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
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
            }`}
          >
            {t(`seeker.applications.status.${item}`)}
          </button>
        ))}
      </div>

      {query.isPending ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
      ) : applications.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("seeker.applications.empty")}
          </p>
          <Link
            to="/jobs"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white transition hover:bg-brand-600"
          >
            {t("jobs.heading")}
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {applications.map((application) => (
              <Link
                key={application.id}
                to={`/dashboard/applications/${application.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {application.job.title}
                  </h3>
                  <p className="mt-0.5 text-theme-sm text-gray-500 dark:text-gray-400">
                    {application.job.company.name}
                  </p>
                  <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">
                    {t("seeker.applications.appliedAt", {
                      date: formatDate(application.createdAt),
                    })}
                  </p>
                </div>
                <ApplicationStatusBadge status={application.status} />
              </Link>
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
