import type { ApplicationHistoryEntry } from "@/lib/seeker-types";
import { formatDate } from "@/utils/format";
import { useTranslation } from "react-i18next";

export default function ApplicationTimeline({
  history,
}: {
  history: ApplicationHistoryEntry[];
}) {
  const { t } = useTranslation();

  return (
    <ol className="relative ms-3 space-y-6 border-s border-gray-200 dark:border-gray-800">
      {history.map((entry, index) => (
        <li key={index} className="ms-6">
          <span className="absolute -start-1.5 mt-1.5 size-3 rounded-full border border-white bg-brand-500 dark:border-gray-900" />
          <p className="text-theme-sm font-medium text-gray-800 dark:text-gray-200">
            {entry.fromStatus
              ? t("seeker.applications.timelineChanged", {
                  from: t(`seeker.applications.status.${entry.fromStatus}`),
                  to: t(`seeker.applications.status.${entry.toStatus}`),
                })
              : t("seeker.applications.timelineCreated", {
                  status: t(`seeker.applications.status.${entry.toStatus}`),
                })}
          </p>
          <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
            {formatDate(entry.createdAt)}
          </p>
          {entry.note ? (
            <p className="mt-1 rounded-lg bg-gray-50 px-3 py-2 text-theme-xs text-gray-600 dark:bg-white/5 dark:text-gray-400">
              {entry.note}
            </p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
