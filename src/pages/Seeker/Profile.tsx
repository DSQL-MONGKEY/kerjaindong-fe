import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { SkeletonForm } from "@/components/ui/skeleton/Skeleton";
import ProfileForm from "@/components/seeker/ProfileForm";
import { useSeekerProfile } from "@/hooks/useSeeker";
import { ApiError } from "@/lib/http";
import { useTranslation } from "react-i18next";

export default function SeekerProfilePage() {
  const { t } = useTranslation();
  const profileQuery = useSeekerProfile();

  const notFound =
    profileQuery.isError &&
    profileQuery.error instanceof ApiError &&
    profileQuery.error.status === 404;

  return (
    <>
      <PageMeta
        title={t("seeker.profile.metaTitle")}
        description={t("seeker.profile.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("seeker.profile.title")} />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        {profileQuery.isPending ? (
          <SkeletonForm fields={5} />
        ) : profileQuery.isError && !notFound ? (
          <div className="rounded-xl border border-error-200 bg-error-50 p-4 text-theme-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/10 dark:text-error-400">
            {t("seeker.profile.loadError")}
          </div>
        ) : (
          <ProfileForm profile={notFound ? null : (profileQuery.data ?? null)} />
        )}
      </div>
    </>
  );
}
