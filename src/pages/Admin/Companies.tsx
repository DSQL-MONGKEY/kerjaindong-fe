import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import AdminActionDialog from "@/components/admin/AdminActionDialog";
import { useAdminCompanies, useUpdateCompanyVerification } from "@/hooks/useAdmin";
import { ApiError } from "@/lib/http";
import type { VerificationStatus } from "@/lib/job-types";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const verificationTones: Record<VerificationStatus, string> = {
  UNVERIFIED: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-400",
  PENDING:
    "bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400",
  VERIFIED:
    "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400",
  REJECTED:
    "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400",
};

export default function AdminCompaniesPage() {
  const { t } = useTranslation();
  const [verification, setVerification] = useState<VerificationStatus | "">("");
  const [searchDraft, setSearchDraft] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [dialogCompany, setDialogCompany] = useState<{
    id: string;
    name: string;
    verification: VerificationStatus;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const query = useAdminCompanies(verification, q, page);
  const updateMutation = useUpdateCompanyVerification();

  const companies = query.data?.items ?? [];
  const meta = query.data?.meta;

  const handleSubmit = async (value: string, note: string) => {
    if (!dialogCompany) return;
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync({
        companyId: dialogCompany.id,
        status: value as VerificationStatus,
        ...(note ? { note } : {}),
      });
      setDialogCompany(null);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  return (
    <>
      <PageMeta
        title={t("admin.companies.metaTitle")}
        description={t("admin.companies.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("admin.companies.title")} />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setQ(searchDraft.trim());
          setPage(1);
        }}
        className="mb-5 flex flex-wrap gap-3"
      >
        <input
          aria-label={t("admin.searchPlaceholder")}
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder={t("admin.searchPlaceholder")}
          className="h-11 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
        <select
          aria-label={t("admin.allVerifications")}
          value={verification}
          onChange={(event) => {
            setVerification(event.target.value as VerificationStatus | "");
            setPage(1);
          }}
          className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          <option value="">{t("admin.allVerifications")}</option>
          {(["UNVERIFIED", "PENDING", "VERIFIED", "REJECTED"] as const).map(
            (item) => (
              <option key={item} value={item}>
                {t(`admin.verification.${item}`)}
              </option>
            ),
          )}
        </select>
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-theme-sm font-medium text-white transition hover:bg-brand-600"
        >
          {t("jobs.filters.apply")}
        </button>
      </form>

      {query.isPending ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
      ) : companies.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("admin.companies.empty")}
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
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                        {company.name}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-theme-xs font-medium ${verificationTones[company.verification]}`}
                      >
                        {t(`admin.verification.${company.verification}`)}
                      </span>
                    </div>
                    <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                      {[company.industry, location].filter(Boolean).join(" · ")}
                    </p>
                    <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">
                      {t("admin.companies.meta", {
                        jobs: company._count.jobPosts,
                        members: company._count.employers,
                        date: formatDate(company.createdAt),
                      })}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      setDialogCompany({
                        id: company.id,
                        name: company.name,
                        verification: company.verification,
                      });
                    }}
                    className="rounded-lg bg-brand-500 px-3 py-2 text-theme-xs font-medium text-white transition hover:bg-brand-600"
                  >
                    {t("admin.companies.verify")}
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

      {dialogCompany ? (
        <AdminActionDialog
          title={t("admin.companies.dialogTitle", { name: dialogCompany.name })}
          options={(
            ["PENDING", "VERIFIED", "REJECTED"] as VerificationStatus[]
          ).map((item) => ({
            value: item,
            label: t(`admin.verification.${item}`),
          }))}
          initialValue={dialogCompany.verification}
          noteLabel={t("admin.noteLabel")}
          errorMessage={errorMessage}
          isPending={updateMutation.isPending}
          onSubmit={(value, note) => void handleSubmit(value, note)}
          onClose={() => setDialogCompany(null)}
        />
      ) : null}
    </>
  );
}
