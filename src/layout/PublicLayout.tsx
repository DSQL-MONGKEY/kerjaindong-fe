import PublicFooter from "@/components/common/PublicFooter";
import PublicHeader from "@/components/common/PublicHeader";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";

export default function PublicLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:inset-s-3 focus:top-3 focus:z-99999 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-theme-sm focus:font-medium focus:text-gray-800 focus:shadow-theme-md dark:focus:bg-gray-800 dark:focus:text-white"
      >
        {t("common.skipToContent")}
      </a>
      <PublicHeader />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
