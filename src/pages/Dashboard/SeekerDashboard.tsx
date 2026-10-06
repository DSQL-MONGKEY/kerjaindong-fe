import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { useAuth } from "@/context/AuthContext";
import { useMyApplications } from "@/hooks/useApplications";
import { useFollowedCompanies, useSavedJobs } from "@/hooks/useEngagement";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function SeekerDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const applicationsQuery = useMyApplications(undefined, 1);
  const savedQuery = useSavedJobs(1);
  const followedQuery = useFollowedCompanies(1);

  const stats = [
    {
      label: t("seeker.dashboard.totalApplications"),
      value: applicationsQuery.data?.meta.total ?? 0,
      path: "/dashboard/applications",
    },
    {
      label: t("seeker.dashboard.totalSaved"),
      value: savedQuery.data?.meta.total ?? 0,
      path: "/dashboard/saved-jobs",
    },
    {
      label: t("seeker.dashboard.totalFollowed"),
      value: followedQuery.data?.meta.total ?? 0,
      path: "/dashboard/followed-companies",
    },
  ];

  return (
    <>
      <PageMeta
        title={t("seeker.dashboard.metaTitle")}
        description={t("seeker.dashboard.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("seeker.dashboard.title")} />

      {user && !user.hasSeekerProfile ? (
        <div className="mb-6 rounded-2xl border border-warning-200 bg-warning-50 p-5 dark:border-warning-500/30 dark:bg-warning-500/10">
          <p className="text-theme-sm text-warning-700 dark:text-warning-400">
            {t("seeker.dashboard.profileIncomplete")}
          </p>
          <Link
            to="/dashboard/profile"
            className="mt-3 inline-flex items-center justify-center rounded-lg bg-warning-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-warning-600"
          >
            {t("seeker.dashboard.completeProfile")}
          </Link>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.path}
            className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
          >
            <p className="text-title-sm font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          to="/jobs"
          className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
        >
          <p className="text-base font-semibold text-gray-800 dark:text-white/90">
            {t("seeker.dashboard.browseJobs")}
          </p>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            {t("seeker.dashboard.browseJobsHint")}
          </p>
        </Link>

        <Link
          to="/dashboard/resumes"
          className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-brand-300 dark:border-gray-800 dark:bg-white/3 dark:hover:border-brand-800"
        >
          <p className="text-base font-semibold text-gray-800 dark:text-white/90">
            {t("seeker.dashboard.manageResumes")}
          </p>
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            {t("seeker.dashboard.manageResumesHint")}
          </p>
        </Link>
      </div>
    </>
  );
}
