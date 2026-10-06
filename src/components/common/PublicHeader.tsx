import BrandMark from "@/components/common/BrandMark";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import { homePathForRoles, useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

export default function PublicHeader() {
  const { t } = useTranslation();
  const { user, status } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
      <div className="mx-auto flex h-16 w-full max-w-(--breakpoint-2xl) items-center justify-between gap-4 px-4 md:px-6">
        <Link to="/" className="shrink-0">
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-theme-sm font-medium text-gray-600 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
          >
            {t("publicHeader.home")}
          </Link>
          <Link
            to="/jobs"
            className="text-theme-sm font-medium text-gray-600 transition hover:text-brand-500 dark:text-gray-400 dark:hover:text-brand-400"
          >
            {t("publicHeader.jobs")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggleButton />

          {status === "authenticated" && user ? (
            <Link
              to={homePathForRoles(user.roles)}
              className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
            >
              {t("publicHeader.dashboard")}
            </Link>
          ) : null}

          {status === "anonymous" ? (
            <>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
              >
                {t("publicHeader.signIn")}
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
              >
                {t("publicHeader.signUp")}
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
