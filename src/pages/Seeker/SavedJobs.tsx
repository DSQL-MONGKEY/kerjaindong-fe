import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import JobCard from "@/components/jobs/JobCard";
import { useSavedJobs, useUnsaveJob } from "@/hooks/useEngagement";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function SeekerSavedJobsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const query = useSavedJobs(page);
  const unsaveMutation = useUnsaveJob();

  const jobs = query.data?.items ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <PageMeta
        title={t("seeker.saved.metaTitle")}
        description={t("seeker.saved.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("seeker.saved.title")} />

      {query.isPending ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("seeker.saved.empty")}
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <div key={job.id} className="flex flex-col gap-2">
                <JobCard job={job} />
                <button
                  type="button"
                  onClick={() =>
                    void unsaveMutation.mutateAsync(job.id).catch(() => undefined)
                  }
                  className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                >
                  {t("seeker.saved.unsave")}
                </button>
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
