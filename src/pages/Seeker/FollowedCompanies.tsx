import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import {
  useFollowedCompanies,
  useUnfollowCompany,
} from "@/hooks/useEngagement";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function SeekerFollowedCompaniesPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const query = useFollowedCompanies(page);
  const unfollowMutation = useUnfollowCompany();

  const companies = query.data?.items ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <PageMeta
        title={t("seeker.followed.metaTitle")}
        description={t("seeker.followed.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("seeker.followed.title")} />

      {query.isPending ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
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
                    className="rounded-lg border border-gray-300 px-3 py-2 text-theme-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  >
                    {t("company.unfollow")}
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
