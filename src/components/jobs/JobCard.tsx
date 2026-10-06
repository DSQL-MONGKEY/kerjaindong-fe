import { JobBadges } from "@/components/jobs/JobBadges";
import type { JobCard as JobCardType } from "@/lib/job-types";
import { formatSalary } from "@/utils/format";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function JobCard({ job }: { job: JobCardType }) {
  const { t } = useTranslation();

  const salary = formatSalary(
    job.salaryMin,
    job.salaryMax,
    job.salaryCurrency,
    t(`jobs.salaryPeriod.${job.salaryPeriod}`),
  );

  const location = [job.location.city?.name, job.location.province?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      to={`/jobs/${job.slug}`}
      className="group flex h-full flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 hover:shadow-theme-md dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-gray-800 transition group-hover:text-brand-500 dark:text-white/90">
            {job.title}
          </h3>
          <p className="mt-0.5 truncate text-theme-sm text-gray-500 dark:text-gray-400">
            {job.company.name}
          </p>
        </div>

        {job.company.verification === "VERIFIED" ? (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-success-50 px-2 py-1 text-theme-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-400">
            {t("company.verified")}
          </span>
        ) : null}
      </div>

      <JobBadges job={job} />

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-theme-sm dark:border-gray-800">
        <span className="text-gray-500 dark:text-gray-400">
          {location || t("jobs.remoteLocation")}
        </span>
        <span className="font-medium text-gray-700 dark:text-gray-300">
          {salary || t("jobs.salaryNegotiable")}
        </span>
      </div>
    </Link>
  );
}
