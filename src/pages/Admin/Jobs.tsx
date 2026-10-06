import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import AdminActionDialog from "@/components/admin/AdminActionDialog";
import { JobStatusBadge } from "@/components/employer/StatusBadges";
import { useAdminJobs, useUpdateJobModeration } from "@/hooks/useAdmin";
import type { JobStatus } from "@/lib/employer-types";
import { ApiError } from "@/lib/http";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AdminJobsPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<JobStatus | "">("");
  const [searchDraft, setSearchDraft] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [dialogJob, setDialogJob] = useState<{
    id: string;
    title: string;
    status: JobStatus;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const query = useAdminJobs(status, q, page);
  const updateMutation = useUpdateJobModeration();

  const jobs = query.data?.items ?? [];
  const meta = query.data?.meta;

  const handleSubmit = async (value: string, note: string) => {
    if (!dialogJob) return;
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync({
        jobId: dialogJob.id,
        status: value as JobStatus,
        ...(note ? { note } : {}),
      });
      setDialogJob(null);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  return (
    <>
      <PageMeta
        title={t("admin.jobs.metaTitle")}
        description={t("admin.jobs.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("admin.jobs.title")} />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setQ(searchDraft.trim());
          setPage(1);
        }}
        className="mb-5 flex flex-wrap gap-3"
      >
        <input
          aria-label={t("admin.jobs.searchPlaceholder")}
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder={t("admin.jobs.searchPlaceholder")}
          className="h-11 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
        <select
          aria-label={t("employer.jobs.allStatuses")}
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as JobStatus | "");
            setPage(1);
          }}
          className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          <option value="">{t("employer.jobs.allStatuses")}</option>
          {(["DRAFT", "PUBLISHED", "PAUSED", "CLOSED", "ARCHIVED"] as const).map(
            (item) => (
              <option key={item} value={item}>
                {t(`employer.jobs.status.${item}`)}
              </option>
            ),
          )}
        </select>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-theme-sm font-medium text-white transition hover:bg-brand-600"
        >
          {t("jobs.filters.apply")}
        </button>
      </form>

      {query.isPending ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
      ) : jobs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("admin.jobs.empty")}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                      {job.title}
                    </h3>
                    <JobStatusBadge status={job.status} />
                  </div>
                  <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    {job.company.name}
                  </p>
                  <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">
                    {t("admin.jobs.meta", {
                      applications: job.applicationCount,
                      views: job.viewCount,
                      date: formatDate(job.createdAt),
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setDialogJob({
                      id: job.id,
                      title: job.title,
                      status: job.status,
                    });
                  }}
                  className="rounded-lg bg-brand-500 px-3 py-2 text-theme-xs font-medium text-white transition hover:bg-brand-600"
                >
                  {t("admin.jobs.moderate")}
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

      {dialogJob ? (
        <AdminActionDialog
          title={t("admin.jobs.dialogTitle", { title: dialogJob.title })}
          options={(["PUBLISHED", "PAUSED", "ARCHIVED"] as JobStatus[]).map(
            (item) => ({
              value: item,
              label: t(`employer.jobs.status.${item}`),
            }),
          )}
          initialValue={dialogJob.status}
          noteLabel={t("admin.noteLabel")}
          errorMessage={errorMessage}
          isPending={updateMutation.isPending}
          onSubmit={(value, note) => void handleSubmit(value, note)}
          onClose={() => setDialogJob(null)}
        />
      ) : null}
    </>
  );
}
