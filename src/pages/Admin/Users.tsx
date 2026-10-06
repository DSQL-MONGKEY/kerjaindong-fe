import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import { SkeletonListCard } from "@/components/ui/skeleton/Skeleton";
import AdminActionDialog from "@/components/admin/AdminActionDialog";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/useAdmin";
import { ApiError } from "@/lib/http";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [searchDraft, setSearchDraft] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [dialogUser, setDialogUser] = useState<{
    id: string;
    label: string;
    isActive: boolean;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const query = useAdminUsers(q, page);
  const updateMutation = useUpdateUserStatus();

  const users = query.data?.items ?? [];
  const meta = query.data?.meta;

  const handleSubmit = async (value: string, note: string) => {
    if (!dialogUser) return;
    setErrorMessage(null);

    try {
      await updateMutation.mutateAsync({
        userId: dialogUser.id,
        isActive: value === "true",
        ...(note ? { note } : {}),
      });
      setDialogUser(null);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  return (
    <>
      <PageMeta
        title={t("admin.users.metaTitle")}
        description={t("admin.users.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("admin.users.title")} />

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setQ(searchDraft.trim());
          setPage(1);
        }}
        className="mb-5 flex flex-wrap gap-3"
      >
        <input
          aria-label={t("admin.users.searchPlaceholder")}
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder={t("admin.users.searchPlaceholder")}
          className="h-11 flex-1 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-theme-sm font-medium text-white transition hover:bg-brand-600"
        >
          {t("jobs.filters.apply")}
        </button>
      </form>

      {query.isPending ? (
        <SkeletonListCard rows={5} />
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("admin.users.empty")}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
                      {user.fullName ?? user.username}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-theme-xs font-medium ${
                        user.isActive
                          ? "bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400"
                          : "bg-error-50 text-error-600 dark:bg-error-500/15 dark:text-error-400"
                      }`}
                    >
                      {user.isActive
                        ? t("admin.users.active")
                        : t("admin.users.inactive")}
                    </span>
                  </div>
                  <p className="mt-1 text-theme-xs text-gray-500 dark:text-gray-400">
                    {user.email} · @{user.username} ·{" "}
                    {user.roles.join(", ") || "-"}
                  </p>
                  <p className="mt-1 text-theme-xs text-gray-400 dark:text-gray-500">
                    {t("admin.users.joinedAt", {
                      date: formatDate(user.createdAt),
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setDialogUser({
                      id: user.id,
                      label: user.fullName ?? user.username,
                      isActive: user.isActive,
                    });
                  }}
                  className="rounded-lg bg-brand-500 px-3 py-2 text-theme-xs font-medium text-white transition hover:bg-brand-600"
                >
                  {t("admin.users.manage")}
                </button>
              </div>
            ))}
          </div>

          {meta ? (
            <SimplePagination
              page={meta.page}
              totalPages={meta.totalPages}
              onChange={setPage}
            />
          ) : null}
        </>
      )}

      {dialogUser ? (
        <AdminActionDialog
          title={t("admin.users.dialogTitle", { name: dialogUser.label })}
          options={[
            { value: "true", label: t("admin.users.activate") },
            { value: "false", label: t("admin.users.deactivate") },
          ]}
          initialValue={dialogUser.isActive ? "true" : "false"}
          noteLabel={t("admin.noteLabel")}
          errorMessage={errorMessage}
          isPending={updateMutation.isPending}
          onSubmit={(value, note) => void handleSubmit(value, note)}
          onClose={() => setDialogUser(null)}
        />
      ) : null}
    </>
  );
}
