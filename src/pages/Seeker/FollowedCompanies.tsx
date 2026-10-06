import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import { SkeletonListCard } from "@/components/ui/skeleton/Skeleton";
import { useAuth } from "@/context/AuthContext";
import {
  useFollowedCompanies,
  useUnfollowCompany,
} from "@/hooks/useEngagement";
import { ApiError, isApiError } from "@/lib/http";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function SeekerFollowedCompaniesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const query = useFollowedCompanies(page);
  const unfollowMutation = useUnfollowCompany();

  const companies = query.data?.items ?? [];
  const meta = query.data?.meta;

  const needsProfile =
    user?.hasSeekerProfile === false || isApiError(query.error, 400);

  return (
    <>
      <PageMeta
        title={t("seeker.followed.metaTitle")}
        description={t("seeker.followed.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("seeker.followed.title")} />

      {query.isPending ? (
        <SkeletonListCard rows={3} avatar />
      ) : query.isError ? (
        <div className="rounded-2xl border border-error-200 bg-error-50 p-6 dark:border-error-500/30 dark:bg-error-500/10">
          <p className="text-theme-sm text-error-600 dark:text-error-400">
            {query.error instanceof ApiError
              ? query.error.message
              : t("errors.generic")}
          </p>
          {needsProfile ? (
            <Link
              to="/dashboard/profile"
              className="mt-3 inline-flex items-center justify-center rounded-lg bg-warning-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-warning-600"
            >
              {t("seeker.dashboard.completeProfile")}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => void query.refetch()}
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-error-300 bg-white px-4 py-2 text-theme-sm font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/40 dark:bg-transparent dark:text-error-400"
            >
              {t("common.retry")}
            </button>
          )}
        </div>
      ) : companies.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("seeker.followed.empty")}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {companies.map((company) => {
              const location = [
                company.location.city?.name,
                company.location.province?.name,
              ]
                .filter(Boolean)
                .join(", ");

              const isUnfollowing =
                unfollowMutation.isPending &&
                unfollowMutation.variables === company.id;

              return (
                <div
                  key={company.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-50 text-lg font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                      {company.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <Link
                        to={`/companies/${company.slug}`}
                        className="text-base font-semibold text-gray-800 hover:text-brand-500 dark:text-white/90"
                      >
                        {company.name}
                      </Link>
                      <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
                        {[company.industry, location]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      void unfollowMutation
                        .mutateAsync(company.id)
                        .catch(() => undefined)
                    }
                    disabled={isUnfollowing}
                    className="rounded-lg border border-gray-300 px-3 py-2 text-theme-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  >
                    {isUnfollowing
                      ? t("common.loading")
                      : t("company.unfollow")}
                  </button>
                </div>
              );
            })}
          </div>

          {meta ? (
            <SimplePagination
              page={meta.page}
              totalPages={meta.totalPages}
              onChange={setPage}
            />
          ) : null}
        </>
      )}
    </>
  );
}
