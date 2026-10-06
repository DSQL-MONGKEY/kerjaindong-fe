import type {
  EmploymentType,
  ExperienceLevel,
  JobCard,
  WorkMode,
} from "@/lib/job-types";
import { useTranslation } from "react-i18next";

const chipClass =
  "inline-flex items-center rounded-full px-2.5 py-1 text-theme-xs font-medium";

export function EmploymentTypeChip({ value }: { value: EmploymentType }) {
  const { t } = useTranslation();
  return (
    <span
      className={`${chipClass} bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400`}
    >
      {t(`jobs.employmentType.${value}`)}
    </span>
  );
}

export function WorkModeChip({ value }: { value: WorkMode }) {
  const { t } = useTranslation();
  return (
    <span
      className={`${chipClass} bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300`}
    >
      {t(`jobs.workMode.${value}`)}
    </span>
  );
}

export function ExperienceLevelChip({ value }: { value: ExperienceLevel }) {
  const { t } = useTranslation();
  return (
    <span
      className={`${chipClass} bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400`}
    >
      {t(`jobs.experienceLevel.${value}`)}
    </span>
  );
}

export function JobBadges({
  job,
}: {
  job: Pick<JobCard, "employmentType" | "workMode" | "experienceLevel">;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <EmploymentTypeChip value={job.employmentType} />
      <WorkModeChip value={job.workMode} />
      {job.experienceLevel ? (
        <ExperienceLevelChip value={job.experienceLevel} />
      ) : null}
    </div>
  );
}
