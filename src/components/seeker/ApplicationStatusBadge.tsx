import type { ApplicationStatus } from "@/lib/seeker-types";
import { useTranslation } from "react-i18next";

const tones: Record<ApplicationStatus, string> = {
  APPLIED:
    "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400",
  REVIEWING:
    "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
  SHORTLISTED:
    "bg-theme-purple-500/10 text-theme-purple-500 dark:bg-theme-purple-500/20",
  ACCEPTED:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
  REJECTED:
    "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400",
  WITHDRAWN:
    "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
};

export default function ApplicationStatusBadge({
  status,
}: {
  status: ApplicationStatus;
}) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-theme-xs font-medium ${tones[status]}`}
    >
      {t(`seeker.applications.status.${status}`)}
    </span>
  );
}
