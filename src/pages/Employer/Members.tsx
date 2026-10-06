import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import {
  SkeletonListCard,
  SkeletonRows,
} from "@/components/ui/skeleton/Skeleton";
import { useAuth } from "@/context/AuthContext";
import {
  useCreateInvitation,
  useInvitations,
  useMembers,
  useMyCompany,
  useRemoveMember,
} from "@/hooks/useEmployer";
import type { CompanyMemberRole } from "@/lib/employer-types";
import { ApiError } from "@/lib/http";
import type { CreatedInvitation } from "@/lib/employer-types";
import { formatDate } from "@/utils/format";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";

export default function EmployerMembersPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const companyQuery = useMyCompany();
  const company = companyQuery.data;
  const membersQuery = useMembers(company?.id);
  const invitationsQuery = useInvitations(company?.id);
  const createInvitation = useCreateInvitation(company?.id);
  const removeMember = useRemoveMember(company?.id);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<CompanyMemberRole>("RECRUITER");
  const [createdInvitation, setCreatedInvitation] =
    useState<CreatedInvitation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (companyQuery.isPending) {
    return <SkeletonListCard rows={3} />;
  }

  if (!company) {
    return <Navigate to="/employer/company" replace />;
  }

  const canManage =
    company.membership.companyRole === "OWNER" ||
    company.membership.companyRole === "ADMIN";

  const members = membersQuery.data ?? [];
  const invitations = invitationsQuery.data ?? [];

  const handleInvite = async () => {
    setErrorMessage(null);
    setCreatedInvitation(null);

    if (!email.trim()) {
      setErrorMessage(t("employer.members.emailRequired"));
      return;
    }

    try {
      const invitation = await createInvitation.mutateAsync({
        email: email.trim().toLowerCase(),
        role,
      });
      setCreatedInvitation(invitation);
      setEmail("");
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  const handleRemove = async (userId: string) => {
    if (!window.confirm(t("employer.members.confirmRemove"))) return;
    await removeMember.mutateAsync(userId).catch(() => undefined);
  };

  return (
    <>
      <PageMeta
        title={t("employer.members.metaTitle")}
        description={t("employer.members.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("employer.members.title")} />

      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
            {t("employer.members.listTitle")}
          </h2>

          <div className="space-y-3">
            {membersQuery.isPending ? (
              <SkeletonRows rows={3} />
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-theme-sm font-semibold text-gray-800 dark:text-gray-200">
                        {[member.firstName, member.lastName]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                      <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-theme-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-400">
                        {t(`employer.roles.${member.companyRole}`)}
                      </span>
                      {!member.isActive ? (
                        <span className="rounded-full bg-error-50 px-2.5 py-0.5 text-theme-xs font-medium text-error-600 dark:bg-error-500/15 dark:text-error-400">
                          {t("employer.members.inactive")}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-theme-xs text-gray-500 dark:text-gray-400">
                      {member.user.email}
                      {member.position ? ` · ${member.position}` : ""}
                    </p>
                  </div>

                  {canManage &&
                  member.companyRole !== "OWNER" &&
                  member.userId !== user?.id &&
                  member.isActive ? (
                    <button
                      type="button"
                      onClick={() => void handleRemove(member.userId)}
                      className="rounded-lg border border-error-300 px-3 py-2 text-theme-xs font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/40 dark:text-error-400"
                    >
                      {t("employer.members.remove")}
                    </button>
                  ) : null}
                </div>
              ))
            )}
          </div>
        </div>

        {canManage ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <h2 className="mb-4 text-base font-semibold text-gray-800 dark:text-white/90">
              {t("employer.members.inviteTitle")}
            </h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label
                  htmlFor="invite-email"
                  className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("employer.members.email")}
                </label>
                <input
                  id="invite-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                />
              </div>

              <div>
                <label
                  htmlFor="invite-role"
                  className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
                >
                  {t("employer.members.role")}
                </label>
                <select
                  id="invite-role"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as CompanyMemberRole)
                  }
                  className="h-11 rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
                >
                  <option value="RECRUITER">
                    {t("employer.roles.RECRUITER")}
                  </option>
                  <option value="ADMIN">{t("employer.roles.ADMIN")}</option>
                </select>
              </div>

              <button
                type="button"
                onClick={() => void handleInvite()}
                disabled={createInvitation.isPending}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-500 px-5 text-theme-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
              >
                {createInvitation.isPending
                  ? t("common.loading")
                  : t("employer.members.invite")}
              </button>
            </div>

            {errorMessage ? (
              <p className="mt-4 rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                {errorMessage}
              </p>
            ) : null}

            {createdInvitation ? (
              <div className="mt-4 rounded-xl border border-warning-200 bg-warning-50 p-4 dark:border-warning-500/30 dark:bg-warning-500/10">
                <p className="text-theme-sm text-warning-700 dark:text-warning-400">
                  {t("employer.members.tokenNotice")}
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <code className="max-w-full overflow-x-auto rounded-lg bg-white px-3 py-2 text-theme-xs text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                    {`${window.location.origin}/invitations/${createdInvitation.token}`}
                  </code>
                </div>
              </div>
            ) : null}

            {invitationsQuery.isPending ? (
              <div className="mt-6">
                <h3 className="mb-3 text-theme-sm font-semibold text-gray-800 dark:text-gray-200">
                  {t("employer.members.invitationsTitle")}
                </h3>
                <SkeletonRows rows={2} />
              </div>
            ) : invitations.length > 0 ? (
              <div className="mt-6">
                <h3 className="mb-3 text-theme-sm font-semibold text-gray-800 dark:text-gray-200">
                  {t("employer.members.invitationsTitle")}
                </h3>
                <div className="space-y-2">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gray-100 p-3 dark:border-gray-800"
                    >
                      <div>
                        <p className="text-theme-sm text-gray-800 dark:text-gray-200">
                          {invitation.email}
                        </p>
                        <p className="text-theme-xs text-gray-500 dark:text-gray-400">
                          {t(`employer.roles.${invitation.role}`)} ·{" "}
                          {t("employer.members.expiresAt", {
                            date: formatDate(invitation.expiresAt),
                          })}
                        </p>
                      </div>
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-theme-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-400">
                        {t(`employer.members.invitationStatus.${invitation.status}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
