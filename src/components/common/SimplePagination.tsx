import { useTranslation } from "react-i18next";

interface SimplePaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function SimplePagination({
  page,
  totalPages,
  onChange,
}: SimplePaginationProps) {
  const { t } = useTranslation();

  if (totalPages <= 1) return null;

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
      >
        {t("common.previous")}
      </button>

      <span className="text-theme-sm text-gray-500 dark:text-gray-400">
        {t("common.pageOf", { page, total: totalPages })}
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
      >
        {t("common.next")}
      </button>
    </div>
  );
}
