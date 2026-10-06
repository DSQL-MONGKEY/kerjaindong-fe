import { useAuth } from "@/context/AuthContext";
import { useSaveJob, useUnsaveJob } from "@/hooks/useEngagement";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function SaveJobButton({ jobId }: { jobId: string }) {
  const { t } = useTranslation();
  const { user, status } = useAuth();
  const [saved, setSaved] = useState(false);
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();

  const isSeeker = user?.roles.includes("JOB_SEEKER") ?? false;

  if (status !== "authenticated" || !isSeeker) return null;

  const handleToggle = async () => {
    if (saved) {
      await unsaveMutation.mutateAsync(jobId).catch(() => undefined);
      setSaved(false);
    } else {
      await saveMutation.mutateAsync(jobId).catch(() => undefined);
      setSaved(true);
    }
  };

  const pending = saveMutation.isPending || unsaveMutation.isPending;

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
    >
      {saved ? t("seeker.saved.unsave") : t("seeker.saved.save")}
    </button>
  );
}
