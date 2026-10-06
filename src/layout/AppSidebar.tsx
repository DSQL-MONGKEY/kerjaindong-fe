import BrandMark from "@/components/common/BrandMark";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import {
  BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";
import { cn } from "../utils";

type SubmenuState = { type: "main" | "others"; index: number } | null;

type NavItem = {
  name: string;
  key?: string;
  icon: React.ReactNode;
  path?: string;
  new?: boolean;
  target?: string;
  subItems?: {
    name: string;
    key?: string;
    path: string;
    pro?: boolean;
    new?: boolean;
    target?: string;
  }[];
};

/**
 * Menu dasar per role. Item fitur lengkap ditambahkan pada FE-3 s/d FE-5.
 */
const othersItems: NavItem[] = [];

/** Cari submenu yang cocok dengan rute aktif (dihitung saat render). */
function findActiveSubmenu(
  containers: Array<{ type: "main" | "others"; items: NavItem[] }>,
  pathname: string,
): SubmenuState {
  for (const { type, items } of containers) {
    for (let index = 0; index < items.length; index += 1) {
      const subItems = items[index].subItems;
      if (!subItems) continue;

      const matched = subItems.some(
        (subItem) =>
          pathname === subItem.path || pathname.startsWith(`${subItem.path}/`),
      );

      if (matched) return { type, index };
    }
  }

  return null;
}

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen } =
    useSidebar();
  const { t } = useTranslation();
  const location = useLocation();
  const { user } = useAuth();

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      {
        icon: <GridIcon fontSize={24} />,
        name: "Beranda",
        key: "home",
        path: "/",
      },
    ];

    const roles = user?.roles ?? [];

    if (roles.includes("JOB_SEEKER")) {
      items.push({
        icon: <UserCircleIcon fontSize={24} />,
        name: "Dashboard",
        key: "dashboard",
        subItems: [
          { name: "Ringkasan", key: "seekerOverview", path: "/dashboard" },
          { name: "Profil", key: "seekerProfile", path: "/dashboard/profile" },
          { name: "Resume", key: "seekerResumes", path: "/dashboard/resumes" },
          {
            name: "Lamaran",
            key: "seekerApplications",
            path: "/dashboard/applications",
          },
          {
            name: "Tersimpan",
            key: "seekerSaved",
            path: "/dashboard/saved-jobs",
          },
          {
            name: "Diikuti",
            key: "seekerFollowed",
            path: "/dashboard/followed-companies",
          },
        ],
      });
    }

    if (roles.includes("EMPLOYER")) {
      items.push({
        icon: <BoxCubeIcon fontSize={24} />,
        name: "Perusahaan",
        key: "employerDashboard",
        subItems: [
          { name: "Ringkasan", key: "employerOverview", path: "/employer" },
          { name: "Profil", key: "employerCompany", path: "/employer/company" },
          { name: "Lowongan", key: "employerJobs", path: "/employer/jobs" },
          { name: "Anggota", key: "employerMembers", path: "/employer/members" },
        ],
      });
    }

    if (roles.includes("SYS_ADMIN")) {
      items.push({
        icon: <PlugInIcon fontSize={24} />,
        name: "Admin",
        key: "adminDashboard",
        subItems: [
          {
            name: "Perusahaan",
            key: "adminCompanies",
            path: "/admin/companies",
          },
          { name: "Pengguna", key: "adminUsers", path: "/admin/users" },
          { name: "Lowongan", key: "adminJobs", path: "/admin/jobs" },
          { name: "Audit Log", key: "adminAudit", path: "/admin/audit-logs" },
        ],
      });
    }

    return items;
  }, [user]);

  // Submenu otomatis terbuka mengikuti rute aktif; klik user memberi override
  // yang otomatis hangus saat pindah halaman (tanpa setState di effect).
  const [manualMenu, setManualMenu] = useState<{
    path: string;
    value: SubmenuState | "closed";
  } | null>(null);

  const activeSubmenu = findActiveSubmenu(
    [
      { type: "main", items: navItems },
      { type: "others", items: othersItems },
    ],
    location.pathname,
  );

  const openSubmenu: SubmenuState =
    manualMenu && manualMenu.path === location.pathname
      ? manualMenu.value === "closed"
        ? null
        : manualMenu.value
      : activeSubmenu;

  // Auto-close sidebar on mobile after route change
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname],
  );

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    const isOpen =
      openSubmenu?.type === menuType && openSubmenu?.index === index;

    setManualMenu({
      path: location.pathname,
      value: isOpen ? "closed" : { type: menuType, index },
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => {
        const isSubmenuOpen =
          openSubmenu?.type === menuType && openSubmenu?.index === index;

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                aria-expanded={isSubmenuOpen}
                className={`group menu-item ${
                  isSubmenuOpen ? "menu-item-active" : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "xl:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isSubmenuOpen
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">
                    {nav.key ? t(`sidebar.items.${nav.key}`) : nav.name}
                  </span>
                )}
                {nav.new && (isExpanded || isHovered || isMobileOpen) && (
                  <span
                    className={`absolute inset-e-10 ms-auto ${
                      isSubmenuOpen
                        ? "menu-dropdown-badge-active"
                        : "menu-dropdown-badge-inactive"
                    } menu-dropdown-badge`}
                  >
                    {t("sidebar.badges.new")}
                  </span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ms-auto h-5 w-5 transition-transform duration-200 ${
                      isSubmenuOpen ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  to={nav.path}
                  target={nav.target}
                  aria-current={isActive(nav.path) ? "page" : undefined}
                  className={`group menu-item ${
                    isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                  }`}
                >
                  <span
                    className={`menu-item-icon-size ${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">
                      {nav.key ? t(`sidebar.items.${nav.key}`) : nav.name}
                    </span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-300",
                  isSubmenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <ul className="ms-9 mt-2 space-y-1">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          target={subItem.target}
                          aria-current={
                            isActive(subItem.path) ? "page" : undefined
                          }
                          className={`menu-dropdown-item ${
                            isActive(subItem.path)
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.key
                            ? t(`sidebar.items.${subItem.key}`)
                            : subItem.name}
                          <span className="ms-auto flex items-center gap-1">
                            {subItem.new && (
                              <span
                                className={`ms-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-active"
                                    : "menu-dropdown-badge-inactive"
                                } menu-dropdown-badge`}
                              >
                                {t("sidebar.badges.new")}
                              </span>
                            )}
                            {subItem.pro && (
                              <span
                                className={`ms-auto ${
                                  isActive(subItem.path)
                                    ? "menu-dropdown-badge-pro-active"
                                    : "menu-dropdown-badge-pro-inactive"
                                } menu-dropdown-badge-pro`}
                              >
                                {t("sidebar.badges.pro")}
                              </span>
                            )}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={cn(
        "fixed inset-s-0 top-0 z-50 flex h-screen flex-col border-e border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out xl:translate-x-0 xl:rtl:translate-x-0 dark:border-gray-800 dark:bg-gray-900",
        isExpanded || isMobileOpen ? "w-72.5" : isHovered ? "w-72.5" : "w-22.5",
        isMobileOpen
          ? "translate-x-0"
          : "-translate-x-full rtl:translate-x-full",
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "flex py-8",
          !isExpanded && !isHovered ? "xl:justify-center" : "justify-start",
        )}
      >
        <Link to="/">
          <BrandMark compact={!isExpanded && !isHovered && !isMobileOpen} />
        </Link>
      </div>

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-5 text-gray-400 uppercase ${
                  !isExpanded && !isHovered
                    ? "xl:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  t("sidebar.groups.menu")
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            {othersItems.length > 0 && (
              <div>
                <h2
                  className={`mb-4 flex text-xs leading-5 text-gray-400 uppercase ${
                    !isExpanded && !isHovered
                      ? "xl:justify-center"
                      : "justify-start"
                  }`}
                >
                  {isExpanded || isHovered || isMobileOpen ? (
                    t("sidebar.groups.others")
                  ) : (
                    <HorizontaLDots className="size-6" />
                  )}
                </h2>
                {renderMenuItems(othersItems, "others")}
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
