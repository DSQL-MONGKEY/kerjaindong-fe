import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import ApplicantStatusDialog from "@/components/employer/ApplicantStatusDialog";
import { ApplicantStatusBadge } from "@/components/employer/StatusBadges";
import { useJobApplicants, useManagedJob } from "@/hooks/useEmployer";
import type { ApplicationStatus } from "@/lib/seeker-types";
import { formatDate, formatSalary } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";

const statuses: ApplicationStatus[] = [
  "APPLIED",
  "REVIEWING",
  "SHORTLISTED",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
];

export default function EmployerApplicantsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const jobQuery = useManagedJob(id);
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [page, setPage] = useState(1);
  const [dialogApplication, setDialogApplication] = useState<{
    id: string;
    name: string;
    status: ApplicationStatus;
  } | null>(null);

  const applicantsQuery = useJobApplicants(id, status, page);
  const applicants = applicantsQuery.data?.items ?? [];
  const meta = applicantsQuery.data?.meta;

  return (
    <>
      <PageMeta
        title={t("employer.applicants.metaTitle")}
        description={t("employer.applicants.metaDescription")}
      />
      <PageBreadCrumb
        pageTitle={`${t("employer.applicants.title")}${
          jobQuery.data ? ` — ${jobQuery.data.title}` : ""
        }`}
      />

      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setStatus("");
            setPage(1);
          }}
          className={`rounded-full px-4 py-2 text-theme-xs font-medium transition ${
            status === ""
              ? "bg-brand-500 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300"
          }`}
        >
          {t("employer.applicants.allStatuses")}
        </button>
        {statuses.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setStatus(item);
              setPage(1);
            }}
            className={`rounded-full px-4 py-2 text-theme-xs font-medium transition ${
              status === item
                ? "bg-brand-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-300"
            }`}
          >
            {t(`employer.applicants.status.${item}`)}
          </button>
        ))}
      </div>

      {applicantsQuery.isPending ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
      ) : applicants.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("employer.applicants.empty")}
          </p>
          <Link
            to="/employer/jobs"
            className="mt-4 inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {t("employer.jobs.title")}
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {applicants.map((applicant) => {
              const expectedSalary =
                applicant.applicant.expectedSalary != null
                  ? formatSalary(
                      applicant.applicant.expectedSalary,
                      applicant.applicant.expectedSalary,
                      "IDR",
                      t("jobs.salaryPeriod.MONTHLY"),
                    )
                  : null;

              return (
                <div
                  key={applicant.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                          {applicant.applicant.fullName}
                        </h3>
                        <ApplicantStatusBadge status={applicant.status} />
                      </div>
                      {applicant.applicant.headline ? (
                        <p className="mt-0.5 text-theme-sm text-gray-500 dark:text-gray-400">
                          {applicant.applicant.headline}
                        </p>
                      ) : null}
                      <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                        {[
                          applicant.applicant.email,
                          applicant.applicant.phone,
                          applicant.applicant.location?.name,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                      {expectedSalary ? (
                        <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                          {t("employer.applicants.expectedSalary")}:{" "}
                          {expectedSalary}
                        </p>
                      ) : null}
                      <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">
                        {t("employer.applicants.appliedAt", {
                          date: formatDate(applicant.createdAt),
                        })}
                        {applicant.viewedAt
                          ? ` · ${t("employer.applicants.viewed")}`
                          : ""}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setDialogApplication({
                          id: applicant.id,
                          name: applicant.applicant.fullName,
                          status: applicant.status,
                        })
                      }
                      className="rounded-lg bg-brand-500 px-3 py-2 text-theme-xs font-medium text-white transition hover:bg-brand-600"
                    >
                      {t("employer.applicants.update")}
                    </button>
                  </div>

                  {applicant.coverLetter ? (
                    <p className="mt-3 rounded-xl bg-gray-50 px-4 py-3 text-theme-sm whitespace-pre-line text-gray-600 dark:bg-white/5 dark:text-gray-400">
                      {applicant.coverLetter}
                    </p>
                  ) : null}
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

      {dialogApplication && id ? (
        <ApplicantStatusDialog
          jobId={id}
          applicationId={dialogApplication.id}
          applicantName={dialogApplication.name}
          currentStatus={dialogApplication.status}
          onClose={() => setDialogApplication(null)}
        />
      ) : null}
    </>
  );
}
