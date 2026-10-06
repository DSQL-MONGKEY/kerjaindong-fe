import { useApplyJob } from "@/hooks/useApplications";
import { useResumes, useSeekerProfile } from "@/hooks/useSeeker";
import { ApiError } from "@/lib/http";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

interface ApplyDialogProps {
  job: { id: string; title: string };
  onClose: () => void;
}

export default function ApplyDialog({ job, onClose }: ApplyDialogProps) {
  const { t } = useTranslation();
  const profileQuery = useSeekerProfile();
  const resumesQuery = useResumes();
  const applyMutation = useApplyJob(job.id);
  const [resumeId, setResumeId] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const primaryResume = resumesQuery.data?.find((resume) => resume.isPrimary);
  const profileMissing =
    profileQuery.isError &&
    profileQuery.error instanceof ApiError &&
    profileQuery.error.status === 404;

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
      const application = await applyMutation.mutateAsync({
        ...(resumeId ? { resumeId } : {}),
        ...(coverLetter.trim() ? { coverLetter: coverLetter.trim() } : {}),
      });
      setAppliedId(application.id);
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
      aria-labelledby="apply-dialog-title"
      className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
        <h2
          id="apply-dialog-title"
          className="text-base font-semibold text-gray-900 dark:text-white"
        >
          {t("seeker.apply.title")}
        </h2>
        <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
          {job.title}
        </p>

        {profileMissing ? (
          <div className="mt-5 rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-500/30 dark:bg-warning-500/10">
            <p className="text-theme-sm text-warning-700 dark:text-warning-400">
              {t("seeker.apply.profileRequired")}
            </p>
            <Link
              to="/dashboard/profile"
              onClick={onClose}
              className="mt-3 inline-flex items-center justify-center rounded-lg bg-warning-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-warning-600"
            >
              {t("seeker.apply.completeProfile")}
            </Link>
          </div>
        ) : appliedId ? (
          <div className="mt-5 rounded-xl border border-success-200 bg-success-50 p-4 dark:border-success-500/30 dark:bg-success-500/10">
            <p className="text-theme-sm text-success-700 dark:text-success-400">
              {t("seeker.apply.success")}
            </p>
            <div className="mt-3 flex gap-3">
              <Link
                to={`/dashboard/applications/${appliedId}`}
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg bg-success-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-success-600"
              >
                {t("seeker.apply.viewApplication")}
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="apply-resume"
                className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("seeker.apply.resumeLabel")}
              </label>
              <select
                id="apply-resume"
                value={resumeId}
                onChange={(event) => setResumeId(event.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              >
                <option value="">
                  {primaryResume
                    ? t("seeker.apply.usePrimaryResume", {
                        title: primaryResume.title,
                      })
                    : t("seeker.apply.withoutResume")}
                </option>
                {(resumesQuery.data ?? []).map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.title}
                    {resume.isPrimary
                      ? ` (${t("seeker.resumes.primary")})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="apply-cover-letter"
                className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {t("seeker.apply.coverLetterLabel")}
              </label>
              <textarea
                id="apply-cover-letter"
                rows={4}
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
                placeholder={t("seeker.apply.coverLetterPlaceholder")}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
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
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={applyMutation.isPending}
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {applyMutation.isPending
                  ? t("common.loading")
                  : t("seeker.apply.submit")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
