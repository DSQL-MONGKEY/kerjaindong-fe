import PageMeta from "@/components/common/PageMeta";
import JobCard from "@/components/jobs/JobCard";
import JobFilters, {
  type JobFilterState,
} from "@/components/jobs/JobFilters";
import {
  usePublicJobs,
  type JobFilters as ApiJobFilters,
} from "@/hooks/useJobs";
import type { EmploymentType, WorkMode } from "@/lib/job-types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";

const EMPLOYMENT_TYPES = new Set<EmploymentType>([
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
]);

const WORK_MODES = new Set<WorkMode>(["ONSITE", "REMOTE", "HYBRID"]);

function JobCardSkeleton() {
  return (
    <div className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/3" />
  );
}

export default function Jobs() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterState: JobFilterState = useMemo(
    () => ({
      q: searchParams.get("q") ?? "",
      provinceId: searchParams.get("provinceId") ?? "",
      cityId: searchParams.get("cityId") ?? "",
      employmentType: searchParams.get("employmentType") ?? "",
      workMode: searchParams.get("workMode") ?? "",
      salaryMin: searchParams.get("salaryMin") ?? "",
    }),
    [searchParams],
  );

  const apiFilters: ApiJobFilters = useMemo(() => {
    const employmentType = filterState.employmentType as EmploymentType;
    const workMode = filterState.workMode as WorkMode;
    const salaryMin = Number(filterState.salaryMin);

    return {
      ...(filterState.q ? { q: filterState.q } : {}),
      ...(filterState.provinceId ? { provinceId: filterState.provinceId } : {}),
      ...(filterState.cityId ? { cityId: filterState.cityId } : {}),
      ...(EMPLOYMENT_TYPES.has(employmentType) ? { employmentType } : {}),
      ...(WORK_MODES.has(workMode) ? { workMode } : {}),
      ...(salaryMin > 0 ? { salaryMin } : {}),
    };
  }, [filterState]);

  const query = usePublicJobs(apiFilters);
  const jobs = query.data?.pages.flatMap((page) => page.items) ?? [];

  const patchFilters = (patch: Partial<JobFilterState>) => {
    const next = new URLSearchParams(searchParams);

    for (const [key, value] of Object.entries(patch)) {
      if (value === "" || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }

    setSearchParams(next, { replace: true });
  };

  return (
    <>
      <PageMeta
        title={t("jobs.metaTitle")}
        description={t("jobs.metaDescription")}
      />

      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 py-10 md:px-6">
        <div className="mb-6">
          <h1 className="text-title-sm font-bold text-gray-900 dark:text-white">
            {t("jobs.heading")}
          </h1>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            {t("jobs.subheading")}
          </p>
        </div>

        <JobFilters
          value={filterState}
          onChange={patchFilters}
          onReset={() => setSearchParams(new URLSearchParams(), { replace: true })}
        />

        <div className="mt-8">
          {query.isPending ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : query.isError ? (
            <div className="rounded-2xl border border-error-200 bg-error-50 p-6 text-center dark:border-error-500/30 dark:bg-error-500/10">
              <p className="text-theme-sm text-error-600 dark:text-error-400">
                {t("jobs.error")}
              </p>
              <button
                type="button"
                onClick={() => void query.refetch()}
                className="mt-3 inline-flex items-center justify-center rounded-lg border border-error-300 bg-white px-4 py-2 text-theme-sm font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/40 dark:bg-transparent dark:text-error-400"
              >
                {t("common.retry")}
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
              <p className="text-base font-medium text-gray-700 dark:text-gray-300">
                {t("jobs.empty")}
              </p>
              <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
                {t("jobs.emptyHint")}
              </p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-theme-sm text-gray-500 dark:text-gray-400">
                {t("jobs.resultCount", { count: jobs.length })}
              </p>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>

              {query.hasNextPage ? (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => void query.fetchNextPage()}
                    disabled={query.isFetchingNextPage}
                    className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
                  >
                    {query.isFetchingNextPage
                      ? t("common.loading")
                      : t("jobs.loadMore")}
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </>
  );
}
