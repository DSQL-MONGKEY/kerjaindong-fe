import { JobBadges } from "@/components/jobs/JobBadges";
import PageMeta from "@/components/common/PageMeta";
import Skeleton, {
  SkeletonText,
} from "@/components/ui/skeleton/Skeleton";
import ApplyDialog from "@/components/seeker/ApplyDialog";
import SaveJobButton from "@/components/seeker/SaveJobButton";
import { useAuth } from "@/context/AuthContext";
import { useJobDetail } from "@/hooks/useJobs";
import { formatDate, formatSalary } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router";

export default function JobDetail() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const query = useJobDetail(slug);
  const { user, status } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [applyOpen, setApplyOpen] = useState(false);

  if (query.isPending) {
    return (
      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 py-10 md:px-6">
        <Skeleton className="mb-6 h-4 w-24" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="mt-2.5 h-4 w-1/3" />
              <div className="mt-4 flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <SkeletonText lines={2} className="mt-4" />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
              <Skeleton className="h-4 w-36" />
              <SkeletonText lines={4} className="mt-4" />
            </div>
          </div>
          <aside>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="mt-2 h-4 w-32" />
              <Skeleton className="mt-4 h-3.5 w-20" />
              <Skeleton className="mt-2 h-4 w-40" />
              <Skeleton className="mt-5 h-10 w-full rounded-lg" />
              <Skeleton className="mt-3 h-10 w-full rounded-lg" />
            </div>
          </aside>
        </div>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <>
        <PageMeta
          title={t("jobs.detail.notFoundTitle")}
          description={t("jobs.detail.notFoundTitle")}
        />
        <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 py-16 text-center md:px-6">
          <h1 className="text-title-sm font-bold text-gray-900 dark:text-white">
            {t("jobs.detail.notFoundTitle")}
          </h1>
          <p className="mt-2 text-theme-sm text-gray-500 dark:text-gray-400">
            {t("jobs.detail.notFoundMessage")}
          </p>
          <Link
            to="/jobs"
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white transition hover:bg-brand-600"
          >
            {t("jobs.detail.backToList")}
          </Link>
        </div>
      </>
    );
  }

  const job = query.data;
  const isSeeker = user?.roles.includes("JOB_SEEKER") ?? false;

  const salary = formatSalary(
    job.salaryMin,
    job.salaryMax,
    job.salaryCurrency,
    t(`jobs.salaryPeriod.${job.salaryPeriod}`),
  );

  const locationText = [job.location.city?.name, job.location.province?.name]
    .filter(Boolean)
    .join(", ");

  const handleApply = () => {
    if (status !== "authenticated") {
      navigate("/signin", { state: { from: location.pathname } });
      return;
    }
    setApplyOpen(true);
  };

  const applyLabel =
    status !== "authenticated"
      ? t("jobs.detail.applySignIn")
      : isSeeker
        ? t("jobs.detail.apply")
        : t("jobs.detail.applySeekerOnly");

  return (
    <>
      <PageMeta
        title={`${job.title} — ${job.company.name} | Kerjaindong`}
        description={job.description.slice(0, 155)}
      />

      <div className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 py-10 md:px-6">
        <Link
          to="/jobs"
          className="mb-6 inline-flex items-center text-theme-sm text-gray-500 transition hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          {t("jobs.detail.backToList")}
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
              <h1 className="text-title-sm font-bold text-gray-900 dark:text-white">
                {job.title}
              </h1>
              <Link
                to={`/companies/${job.company.slug}`}
                className="mt-1 inline-block text-theme-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                {job.company.name}
              </Link>

              <div className="mt-4">
                <JobBadges job={job} />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-theme-sm text-gray-500 dark:text-gray-400">
                <span>{locationText || t("jobs.remoteLocation")}</span>
                <span>{t("jobs.detail.posted", { date: formatDate(job.publishedAt) })}</span>
                <span>
                  {t("jobs.detail.views", { count: job.viewCount })}
                </span>
                <span>
                  {t("jobs.detail.applicants", {
                    count: job.applicationCount,
                  })}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-6">
              <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                  {t("jobs.detail.description")}
                </h2>
                <p className="text-theme-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
                  {job.description}
                </p>
              </section>

              {job.requirements ? (
                <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                  <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                    {t("jobs.detail.requirements")}
                  </h2>
                  <p className="text-theme-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
                    {job.requirements}
                  </p>
                </section>
              ) : null}

              {job.benefits ? (
                <section className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
                  <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                    {t("jobs.detail.benefits")}
                  </h2>
                  <p className="text-theme-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
                    {job.benefits}
                  </p>
                </section>
              ) : null}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
              <dl className="space-y-3 text-theme-sm">
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">
                    {t("jobs.detail.salary")}
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-gray-200">
                    {salary || t("jobs.salaryNegotiable")}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">
                    {t("jobs.detail.location")}
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-gray-200">
                    {locationText || t("jobs.remoteLocation")}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500 dark:text-gray-400">
                    {t("jobs.detail.deadline")}
                  </dt>
                  <dd className="font-medium text-gray-800 dark:text-gray-200">
                    {formatDate(job.expiresAt)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handleApply}
                disabled={status === "authenticated" && !isSeeker}
                className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {applyLabel}
              </button>

              <div className="mt-3">
                <SaveJobButton jobId={job.id} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
              <div className="flex items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-lg font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                  {job.company.name.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-theme-sm font-semibold text-gray-800 dark:text-gray-200">
                    {job.company.name}
                  </p>
                  {job.company.industry ? (
                    <p className="truncate text-theme-xs text-gray-500 dark:text-gray-400">
                      {job.company.industry}
                    </p>
                  ) : null}
                </div>
              </div>

              {job.company.description ? (
                <p className="mt-3 line-clamp-4 text-theme-sm text-gray-500 dark:text-gray-400">
                  {job.company.description}
                </p>
              ) : null}

              <Link
                to={`/companies/${job.company.slug}`}
                className="mt-4 inline-flex text-theme-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
              >
                {t("jobs.detail.aboutCompany")}
              </Link>
            </div>
          </aside>
        </div>
      </div>

      {applyOpen ? (
        <ApplyDialog
          job={{ id: job.id, title: job.title }}
          onClose={() => setApplyOpen(false)}
        />
      ) : null}
    </>
  );
}
