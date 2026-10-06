import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import ApplicationStatusBadge from "@/components/seeker/ApplicationStatusBadge";
import ApplicationTimeline from "@/components/seeker/ApplicationTimeline";
import { useApplicationDetail, useWithdrawApplication } from "@/hooks/useApplications";
import { ApiError } from "@/lib/http";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

const TERMINAL = new Set(["ACCEPTED", "REJECTED", "WITHDRAWN"]);

export default function SeekerApplicationDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const query = useApplicationDetail(id);
  const withdrawMutation = useWithdrawApplication();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (query.isPending) {
    return (
      <div className="h-64 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
    );
  }

  if (query.isError || !query.data) {
    const notFound =
      query.error instanceof ApiError && query.error.status === 404;

    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          {notFound
            ? t("seeker.applications.detailNotFound")
            : t("errors.generic")}
        </p>
        <Link
          to="/dashboard/applications"
          className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {t("seeker.applications.backToList")}
        </Link>
      </div>
    );
  }

  const application = query.data;
  const canWithdraw = !TERMINAL.has(application.status);

  const handleWithdraw = async () => {
    if (!window.confirm(t("seeker.applications.confirmWithdraw"))) return;
    setErrorMessage(null);
    try {
      await withdrawMutation.mutateAsync(application.id);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  return (
    <>
      <PageMeta
        title={`${application.job.title} | Kerjaindong`}
        description={t("seeker.applications.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("seeker.applications.detailTitle")} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white/90">
                  {application.job.title}
                </h2>
                <Link
                  to={`/companies/${application.job.company.slug}`}
                  className="mt-0.5 inline-block text-theme-sm font-medium text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  {application.job.company.name}
                </Link>
              </div>
              <ApplicationStatusBadge status={application.status} />
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-3 text-theme-sm sm:grid-cols-2">
              <div>
                <dt className="text-gray-500 dark:text-gray-400">
                  {t("seeker.applications.appliedAtLabel")}
                </dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(application.createdAt)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500 dark:text-gray-400">
                  {t("seeker.applications.lastUpdate")}
                </dt>
                <dd className="font-medium text-gray-800 dark:text-gray-200">
                  {formatDate(application.statusChangedAt ?? application.updatedAt)}
                </dd>
              </div>
            </dl>

            {application.coverLetter ? (
              <div className="mt-4">
                <p className="text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                  {t("seeker.applications.coverLetter")}
                </p>
                <p className="mt-1 text-theme-sm whitespace-pre-line text-gray-600 dark:text-gray-400">
                  {application.coverLetter}
                </p>
              </div>
            ) : null}

            {errorMessage ? (
              <p className="mt-4 rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                {errorMessage}
              </p>
            ) : null}

            {canWithdraw ? (
              <button
                type="button"
                onClick={() => void handleWithdraw()}
                disabled={withdrawMutation.isPending}
                className="mt-5 inline-flex items-center justify-center rounded-lg border border-error-300 px-4 py-2.5 text-theme-sm font-medium text-error-600 transition hover:bg-error-50 disabled:opacity-60 dark:border-error-500/40 dark:text-error-400"
              >
                {withdrawMutation.isPending
                  ? t("common.loading")
                  : t("seeker.applications.withdraw")}
              </button>
            ) : null}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <h3 className="mb-5 text-base font-semibold text-gray-800 dark:text-white/90">
              {t("seeker.applications.timeline")}
            </h3>
            <ApplicationTimeline history={application.history} />
          </div>
        </div>

        <aside>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <h3 className="text-theme-sm font-semibold text-gray-800 dark:text-gray-200">
              {t("seeker.applications.jobInfo")}
            </h3>
            <Link
              to={`/jobs/${application.job.slug}`}
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-brand-600"
            >
              {t("seeker.applications.viewJob")}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
