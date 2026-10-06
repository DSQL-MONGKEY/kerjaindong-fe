import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import SimplePagination from "@/components/common/SimplePagination";
import { useAuditLogs } from "@/hooks/useAdmin";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const entityTypes = ["", "company", "user", "job"];

export default function AdminAuditLogsPage() {
  const { t } = useTranslation();
  const [entityType, setEntityType] = useState("");
  const [page, setPage] = useState(1);

  const query = useAuditLogs(
    entityType ? { entityType } : {},
    page,
  );
  const logs = query.data?.items ?? [];
  const meta = query.data?.meta;

  return (
    <>
      <PageMeta
        title={t("admin.audit.metaTitle")}
        description={t("admin.audit.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("admin.audit.title")} />

      <div className="mb-5 flex flex-wrap gap-3">
        <select
          aria-label={t("admin.audit.allEntities")}
          value={entityType}
          onChange={(event) => {
            setEntityType(event.target.value);
            setPage(1);
          }}
          className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          {entityTypes.map((item) => (
            <option key={item || "all"} value={item}>
              {item
                ? t(`admin.audit.entityTypes.${item}`)
                : t("admin.audit.allEntities")}
            </option>
          ))}
        </select>
      </div>

      {query.isPending ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("admin.audit.empty")}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
            <table className="min-w-full divide-y divide-gray-200 text-theme-sm dark:divide-gray-800">
              <thead className="bg-gray-50 dark:bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    {t("admin.audit.columns.time")}
                  </th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    {t("admin.audit.columns.action")}
                  </th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    {t("admin.audit.columns.entity")}
                  </th>
                  <th className="px-4 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    {t("admin.audit.columns.actor")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-gray-800 dark:text-gray-200">
                      {log.action}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {log.entityType}
                      {log.entityId ? (
                        <span className="ms-1 text-theme-xs text-gray-400 dark:text-gray-500">
                          {log.entityId.slice(0, 8)}…
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {log.actor ? `@${log.actor.username}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
    </>
  );
}
