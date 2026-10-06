import { useAuth } from "@/context/AuthContext";
import {
  useFollowCompany,
  useFollowedCompanies,
  useUnfollowCompany,
} from "@/hooks/useEngagement";
import { ApiError, isApiError } from "@/lib/http";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function FollowCompanyButton({
  companyId,
}: {
  companyId: string;
}) {
  const { t } = useTranslation();
  const { user, status, refreshMe } = useAuth();
  const [override, setOverride] = useState<{
    companyId: string;
    value: boolean;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const followMutation = useFollowCompany();
  const unfollowMutation = useUnfollowCompany();

  const isSeeker = user?.roles.includes("JOB_SEEKER") ?? false;
  const hasProfile = user?.hasSeekerProfile ?? false;
  const canFollow = status === "authenticated" && isSeeker && hasProfile;

  const followedQuery = useFollowedCompanies(1, 100, canFollow);
  const serverFollowing =
    followedQuery.data?.items.some((item) => item.id === companyId) ?? false;
  const following =
    override?.companyId === companyId ? override.value : serverFollowing;

  if (status !== "authenticated" || !isSeeker) return null;

  if (!hasProfile) {
    return (
      <Link
        to="/dashboard/profile"
        className="inline-flex items-center justify-center rounded-lg bg-warning-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs transition hover:bg-warning-600"
      >
        {t("seeker.dashboard.completeProfile")}
      </Link>
    );
  }

  const handleToggle = async () => {
    setErrorMessage(null);
    const next = !following;

    try {
      if (next) {
        await followMutation.mutateAsync(companyId);
      } else {
        await unfollowMutation.mutateAsync(companyId);
      }
      setOverride({ companyId, value: next });
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );

      if (isApiError(error, 400)) {
        void refreshMe();
      }
    }
  };

  const pending =
    followMutation.isPending ||
    unfollowMutation.isPending ||
    followedQuery.isPending;

  return (
    <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
      <button
        type="button"
        onClick={() => void handleToggle()}
        disabled={pending}
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
      >
        {following ? t("company.unfollow") : t("company.follow")}
      </button>
      {errorMessage ? (
        <p className="max-w-64 text-theme-xs text-error-600 dark:text-error-400">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
