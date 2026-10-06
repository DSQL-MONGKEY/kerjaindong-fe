import { useDeleteJob, useJobTransition } from "@/hooks/useEmployer";
import type { JobStatus } from "@/lib/employer-types";
import { useTranslation } from "react-i18next";

const buttonClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-theme-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3";

export default function JobStatusActions({
  jobId,
  status,
}: {
  jobId: string;
  status: JobStatus;
}) {
  const { t } = useTranslation();
  const transitionMutation = useJobTransition(jobId);
  const deleteMutation = useDeleteJob();

  if (status === "ARCHIVED") {
    return null;
  }

  const run = (action: "publish" | "pause" | "close" | "archive") => {
    void transitionMutation.mutateAsync(action).catch(() => undefined);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {status === "DRAFT" ? (
        <button type="button" className={buttonClass} onClick={() => run("publish")}>
          {t("employer.jobs.actions.publish")}
        </button>
      ) : null}

      {status === "PUBLISHED" ? (
        <button type="button" className={buttonClass} onClick={() => run("pause")}>
          {t("employer.jobs.actions.pause")}
        </button>
      ) : null}

      {status === "PAUSED" || status === "CLOSED" ? (
        <button type="button" className={buttonClass} onClick={() => run("publish")}>
          {t("employer.jobs.actions.publish")}
        </button>
      ) : null}

      {status === "PUBLISHED" || status === "PAUSED" ? (
        <button type="button" className={buttonClass} onClick={() => run("close")}>
          {t("employer.jobs.actions.close")}
        </button>
      ) : null}

      <button
        type="button"
        className={buttonClass}
        onClick={() => {
          if (window.confirm(t("employer.jobs.confirmArchive"))) run("archive");
        }}
      >
        {t("employer.jobs.actions.archive")}
      </button>

      {status === "DRAFT" ? (
        <button
          type="button"
          className="rounded-lg border border-error-300 px-3 py-2 text-theme-xs font-medium text-error-600 transition hover:bg-error-50 disabled:opacity-60 dark:border-error-500/40 dark:text-error-400"
          onClick={() => {
            if (window.confirm(t("employer.jobs.confirmDelete"))) {
              void deleteMutation.mutateAsync(jobId).catch(() => undefined);
            }
          }}
        >
          {t("common.delete")}
        </button>
      ) : null}
    </div>
  );
}
