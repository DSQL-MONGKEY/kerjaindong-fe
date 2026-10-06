import { useAuth } from "@/context/AuthContext";
import { useFollowCompany, useUnfollowCompany } from "@/hooks/useEngagement";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FollowCompanyButton({
  companyId,
}: {
  companyId: string;
}) {
  const { t } = useTranslation();
  const { user, status } = useAuth();
  const [following, setFollowing] = useState(false);
  const followMutation = useFollowCompany();
  const unfollowMutation = useUnfollowCompany();

  const isSeeker = user?.roles.includes("JOB_SEEKER") ?? false;

  if (status !== "authenticated" || !isSeeker) return null;

  const handleToggle = async () => {
    if (following) {
      await unfollowMutation.mutateAsync(companyId).catch(() => undefined);
      setFollowing(false);
    } else {
      await followMutation.mutateAsync(companyId).catch(() => undefined);
      setFollowing(true);
    }
  };

  const pending = followMutation.isPending || unfollowMutation.isPending;

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
    >
      {following ? t("company.unfollow") : t("company.follow")}
    </button>
  );
}
