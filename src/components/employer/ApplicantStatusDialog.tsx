import { useUpdateApplicantStatus } from "@/hooks/useEmployer";
import { ApiError } from "@/lib/http";
import type { ApplicationStatus } from "@/lib/seeker-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const settableStatuses: ApplicationStatus[] = [
  "REVIEWING",
  "SHORTLISTED",
  "REJECTED",
  "ACCEPTED",
];

interface ApplicantStatusDialogProps {
  jobId: string;
  applicationId: string;
  applicantName: string;
  currentStatus: ApplicationStatus;
  onClose: () => void;
}

export default function ApplicantStatusDialog({
  jobId,
  applicationId,
  applicantName,
  currentStatus,
  onClose,
}: ApplicantStatusDialogProps) {
  const { t } = useTranslation();
  const mutation = useUpdateApplicantStatus(jobId);
  const [status, setStatus] = useState<ApplicationStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    try {
      await mutation.mutateAsync({
        applicationId,
        status,
        ...(note.trim() ? { note: note.trim() } : {}),
      });
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="applicant-status-dialog-title"
      className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
        <h2
          id="applicant-status-dialog-title"
          className="text-base font-semibold text-gray-900 dark:text-white"
        >
          {t("employer.applicants.updateTitle")}
        </h2>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          {applicantName}
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="applicant-status"
              className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t("employer.applicants.statusLabel")}
            </label>
            <select
              id="applicant-status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ApplicationStatus)
              }
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              {[currentStatus, ...settableStatuses]
                .filter(
                  (item, index, array) => array.indexOf(item) === index,
                )
                .map((item) => (
                  <option key={item} value={item}>
                    {t(`employer.applicants.status.${item}`)}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="applicant-note"
              className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t("employer.applicants.noteLabel")}
            </label>
            <textarea
              id="applicant-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            />
          </div>

          {errorMessage ? (
            <p className="rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={mutation.isPending}
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {mutation.isPending ? t("common.loading") : t("common.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
