import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { cn } from "@/utils";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import Backdrop from "./Backdrop";

const LayoutContent: React.FC = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen xl:flex">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:inset-s-3 focus:top-3 focus:z-99999 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-theme-sm focus:font-medium focus:text-gray-800 focus:shadow-theme-md dark:focus:bg-gray-800 dark:focus:text-white"
      >
        {t("common.skipToContent")}
      </a>
      <AppSidebar />
      <Backdrop />

      <div
        className={cn(
          "flex-1 transition-[margin] duration-300 ease-in-out",
          isExpanded || isHovered ? "xl:ms-72.5" : "xl:ms-22.5",
          isMobileOpen ? "ms-0" : "",
        )}
      >
        <AppHeader />
        <main
          id="main-content"
          className="mx-auto max-w-(--breakpoint-2xl) p-4 md:p-6"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AppLayout: React.FC = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default AppLayout;
