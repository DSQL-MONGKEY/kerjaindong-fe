import { useTranslation } from "react-i18next";

export default function PublicFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-200 bg-white py-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex w-full max-w-(--breakpoint-2xl) flex-col items-center justify-between gap-3 px-4 md:flex-row md:px-6">
        <p className="text-theme-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Kerjaindong
        </p>
        <p className="text-theme-xs text-gray-400 dark:text-gray-500">
          {t("brand.tagline")}
        </p>
      </div>
    </footer>
  );
}
