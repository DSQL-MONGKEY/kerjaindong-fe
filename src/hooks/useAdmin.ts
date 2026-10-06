import { api } from "@/lib/http";
import type {
  AdminAuditLog,
  AdminCompany,
  AdminJob,
  AdminUser,
} from "@/lib/admin-types";
import type { JobStatus } from "@/lib/employer-types";
import type { PaginatedResult } from "@/lib/seeker-types";
import type { VerificationStatus } from "@/lib/job-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ADMIN_KEY = ["admin"] as const;

export function useAdminCompanies(
  verification: VerificationStatus | "",
  q: string,
  page = 1,
) {
  return useQuery({
    queryKey: [...ADMIN_KEY, "companies", { verification, q, page }],
    queryFn: () =>
      api.get<PaginatedResult<AdminCompany>>("/admin/companies", {
        query: {
          verification: verification || undefined,
          q: q || undefined,
          page,
          perPage: 10,
        },
      }),
  });
}

export function useUpdateCompanyVerification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      status,
      note,
    }: {
      companyId: string;
      status: VerificationStatus;
      note?: string;
    }) =>
      api.patch(`/admin/companies/${companyId}/verification`, { status, note }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_KEY, "companies"] });
    },
  });
}

export function useAdminUsers(q: string, page = 1) {
  return useQuery({
    queryKey: [...ADMIN_KEY, "users", { q, page }],
    queryFn: () =>
      api.get<PaginatedResult<AdminUser>>("/admin/users", {
        query: { q: q || undefined, page, perPage: 10 },
      }),
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      isActive,
      note,
    }: {
      userId: string;
      isActive: boolean;
      note?: string;
    }) => api.patch(`/admin/users/${userId}/status`, { isActive, note }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_KEY, "users"] });
    },
  });
}

export function useAdminJobs(
  status: JobStatus | "",
  q: string,
  page = 1,
) {
  return useQuery({
    queryKey: [...ADMIN_KEY, "jobs", { status, q, page }],
    queryFn: () =>
      api.get<PaginatedResult<AdminJob>>("/admin/jobs", {
        query: {
          status: status || undefined,
          q: q || undefined,
          page,
          perPage: 10,
        },
      }),
  });
}

export function useUpdateJobModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      status,
      note,
    }: {
      jobId: string;
      status: JobStatus;
      note?: string;
    }) => api.patch(`/admin/jobs/${jobId}/status`, { status, note }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...ADMIN_KEY, "jobs"] });
    },
  });
}

export interface AuditLogFilters {
  entityType?: string;
  entityId?: string;
  actorUserId?: string;
}

export function useAuditLogs(filters: AuditLogFilters, page = 1) {
  return useQuery({
    queryKey: [...ADMIN_KEY, "audit-logs", { filters, page }],
    queryFn: () =>
      api.get<PaginatedResult<AdminAuditLog>>("/admin/audit-logs", {
        query: { ...filters, page, perPage: 10 },
      }),
  });
}
