import PageMeta from "@/components/common/PageMeta";
import { SkeletonDetail } from "@/components/ui/skeleton/Skeleton";
import { useAuth } from "@/context/AuthContext";
import {
  useAcceptInvitation,
  useInvitationPreview,
} from "@/hooks/useEmployer";
import { ApiError } from "@/lib/http";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate, useParams } from "react-router";

export default function AcceptInvitationPage() {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const { status: authStatus } = useAuth();
  const previewQuery = useInvitationPreview(token);
  const acceptMutation = useAcceptInvitation();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAccept = async () => {
    if (!token) return;
    setErrorMessage(null);

    try {
      await acceptMutation.mutateAsync(token);
      navigate("/employer", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  return (
    <>
      <PageMeta
        title={t("invitation.metaTitle")}
        description={t("invitation.metaDescription")}
      />

      <div className="mx-auto flex min-h-[60vh] w-full max-w-lg flex-col justify-center px-4 py-16">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-white/3">
          {previewQuery.isPending ? (
            <SkeletonDetail />
          ) : previewQuery.isError || !previewQuery.data ? (
            <>
              <h1 className="text-title-sm font-bold text-gray-900 dark:text-white">
                {t("invitation.notFound")}
              </h1>
              <p className="mt-2 text-theme-sm text-gray-500 dark:text-gray-400">
                {t("invitation.notFoundMessage")}
              </p>
              <Link
                to="/"
                className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white transition hover:bg-brand-600"
              >
                {t("notFound.backHome")}
              </Link>
            </>
          ) : (
            <>
              <h1 className="text-title-sm font-bold text-gray-900 dark:text-white">
                {t("invitation.title", {
                  company: previewQuery.data.company.name,
                })}
              </h1>
              <p className="mt-2 text-theme-sm text-gray-500 dark:text-gray-400">
                {t("invitation.roleInfo", {
                  role: t(
                    `employer.roles.${previewQuery.data.role}`,
                  ),
                })}
              </p>
              <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">
                {t("invitation.forEmail", { email: previewQuery.data.email })}{" "}
                ·{" "}
                {t("invitation.expiresAt", {
                  date: formatDate(previewQuery.data.expiresAt),
                })}
              </p>

              {previewQuery.data.status !== "PENDING" ? (
                <p className="mt-6 rounded-lg bg-warning-50 px-4 py-3 text-theme-sm text-warning-700 dark:bg-warning-500/10 dark:text-warning-400">
                  {t(`invitation.status.${previewQuery.data.status}`)}
                </p>
              ) : authStatus !== "authenticated" ? (
                <div className="mt-6 space-y-3">
                  <p className="text-theme-sm text-gray-500 dark:text-gray-400">
                    {t("invitation.signInRequired")}
                  </p>
                  <Link
                    to="/signin"
                    state={{ from: location.pathname }}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white transition hover:bg-brand-600"
                  >
                    {t("publicHeader.signIn")}
                  </Link>
                </div>
              ) : (
                <div className="mt-6 space-y-3">
                  {errorMessage ? (
                    <p className="rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                      {errorMessage}
                    </p>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => void handleAccept()}
                    disabled={acceptMutation.isPending}
                    className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
                  >
                    {acceptMutation.isPending
                      ? t("common.loading")
                      : t("invitation.accept")}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
