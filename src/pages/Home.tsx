import BrandMark from "@/components/common/BrandMark";
import PageMeta from "@/components/common/PageMeta";
import JobCard from "@/components/jobs/JobCard";
import { useAuth } from "@/context/AuthContext";
import { usePublicJobs } from "@/hooks/useJobs";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function Home() {
  const { t } = useTranslation();
  const { status } = useAuth();
  const query = usePublicJobs({}, { limit: 6 });
  const jobs = query.data?.pages.flatMap((page) => page.items) ?? [];

  // CTA pendaftaran hanya untuk pengunjung anonim; user yang sudah login cukup
  // melihat tombol "Lihat Lowongan".
  const showSignupCta = status === "anonymous";

  return (
    <>
      <PageMeta
        title={t("home.metaTitle")}
        description={t("home.metaDescription")}
      />

      <section className="mx-auto flex w-full max-w-(--breakpoint-2xl) flex-col items-center gap-6 px-6 py-16 text-center md:py-24">
        <BrandMark className="scale-125" />

        <h1 className="max-w-2xl text-title-sm font-bold text-gray-900 sm:text-title-lg dark:text-white">
          {t("home.heroTitle")}
        </h1>
        <p className="max-w-xl text-theme-sm text-gray-500 dark:text-gray-400">
          {t("home.heroSubtitle")}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/jobs"
            className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
          >
            {t("home.ctaBrowseJobs")}
          </Link>
          {showSignupCta ? (
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
            >
              {t("home.ctaSignUp")}
            </Link>
          ) : null}
        </div>
      </section>

      <section className="mx-auto w-full max-w-(--breakpoint-2xl) px-4 pb-16 md:px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-title-sm font-bold text-gray-900 dark:text-white">
            {t("home.latestJobs")}
          </h2>
          <Link
            to="/jobs"
            className="text-theme-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
          >
            {t("common.seeAll")}
          </Link>
        </div>

        {query.isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-44 animate-pulse rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-white/3"
              />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
            <p className="text-theme-sm text-gray-500 dark:text-gray-400">
              {t("home.noJobs")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </section>

      {showSignupCta ? (
        <section className="border-t border-gray-200 bg-gray-50 py-12 dark:border-gray-800 dark:bg-white/2">
          <div className="mx-auto flex w-full max-w-(--breakpoint-2xl) flex-col items-center gap-4 px-6 text-center">
            <h2 className="text-title-sm font-bold text-gray-900 dark:text-white">
              {t("home.employerCtaTitle")}
            </h2>
            <p className="max-w-xl text-theme-sm text-gray-500 dark:text-gray-400">
              {t("home.employerCtaSubtitle")}
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              {t("home.employerCtaButton")}
            </Link>
          </div>
        </section>
      ) : null}
    </>
  );
}
