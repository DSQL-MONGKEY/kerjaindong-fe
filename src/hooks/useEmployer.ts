import { api } from "@/lib/http";
import type {
  Applicant,
  CompanyMemberRole,
  CreatedInvitation,
  EmployerJobSummary,
  Invitation,
  InvitationPreview,
  JobStatus,
  Member,
  MyCompany,
} from "@/lib/employer-types";
import type { ApplicationStatus, PaginatedResult } from "@/lib/seeker-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const COMPANY_KEY = ["company", "me"] as const;
const JOBS_KEY = ["employer", "jobs"] as const;
const APPLICANTS_KEY = ["employer", "applicants"] as const;
const MEMBERS_KEY = ["employer", "members"] as const;
const INVITATIONS_KEY = ["employer", "invitations"] as const;

export interface CompanyPayload {
  name: string;
  website?: string;
  industry?: string;
  description?: string;
  provinceId?: string;
  cityId?: string;
  firstName?: string;
  lastName?: string;
  position?: string;
}

export interface JobPayload {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  employmentType: string;
  workMode?: string;
  experienceLevel?: string;
  provinceId?: string;
  cityId?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryPeriod?: string;
  expiresAt?: string;
}

export function useMyCompany() {
  return useQuery({
    queryKey: COMPANY_KEY,
    queryFn: () => api.get<MyCompany>("/companies/me"),
    retry: false,
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompanyPayload) =>
      api.post<MyCompany>("/companies", payload),
    onSuccess: (company) => {
      queryClient.setQueryData(COMPANY_KEY, company);
    },
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<CompanyPayload>) =>
      api.patch<MyCompany>("/companies/me", payload),
    onSuccess: (company) => {
      queryClient.setQueryData(COMPANY_KEY, company);
    },
  });
}

export function useCompanyJobsList(
  companyId: string | undefined,
  status: JobStatus | "",
  page = 1,
) {
  return useQuery({
    queryKey: [...JOBS_KEY, companyId, { status: status || null, page }],
    queryFn: () =>
      api.get<PaginatedResult<EmployerJobSummary>>(
        `/companies/${companyId}/jobs`,
        { query: { status: status || undefined, page, perPage: 10 } },
      ),
    enabled: Boolean(companyId),
  });
}

export function useCreateJob(companyId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: JobPayload) =>
      api.post(`/companies/${companyId}/jobs`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] });
    },
  });
}

export function useManagedJob(jobId: string | undefined) {
  return useQuery({
    queryKey: ["employer", "job", jobId],
    queryFn: () =>
      api.get<EmployerJobSummary & {
        description: string;
        requirements: string | null;
        benefits: string | null;
      }>(`/jobs/${jobId}/manage`),
    enabled: Boolean(jobId),
  });
}

export function useUpdateJob(jobId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<JobPayload>) =>
      api.patch(`/jobs/${jobId}`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] });
      void queryClient.invalidateQueries({
        queryKey: ["employer", "job", jobId],
      });
    },
  });
}

export function useJobTransition(jobId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "publish" | "pause" | "close" | "archive") =>
      api.post(`/jobs/${jobId}/${action}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] });
      void queryClient.invalidateQueries({
        queryKey: ["employer", "job", jobId],
      });
    },
  });
}

export function useDeleteJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => api.delete(`/jobs/${jobId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["employer", "jobs"] });
    },
  });
}

export function useJobApplicants(
  jobId: string | undefined,
  status: ApplicationStatus | "",
  page = 1,
) {
  return useQuery({
    queryKey: [...APPLICANTS_KEY, jobId, { status: status || null, page }],
    queryFn: () =>
      api.get<PaginatedResult<Applicant>>(`/jobs/${jobId}/applications`, {
        query: { status: status || undefined, page, perPage: 10 },
      }),
    enabled: Boolean(jobId),
  });
}

export function useUpdateApplicantStatus(jobId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      status,
      note,
    }: {
      applicationId: string;
      status: ApplicationStatus;
      note?: string;
    }) =>
      api.patch(`/applications/${applicationId}/status`, { status, note }),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...APPLICANTS_KEY, jobId],
      });
    },
  });
}

export function useMembers(companyId: string | undefined) {
  return useQuery({
    queryKey: [...MEMBERS_KEY, companyId],
    queryFn: () => api.get<Member[]>(`/companies/${companyId}/members`),
    enabled: Boolean(companyId),
  });
}

export function useRemoveMember(companyId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      api.delete(`/companies/${companyId}/members/${userId}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [...MEMBERS_KEY, companyId] });
    },
  });
}

export function useInvitations(companyId: string | undefined) {
  return useQuery({
    queryKey: [...INVITATIONS_KEY, companyId],
    queryFn: () => api.get<Invitation[]>(`/companies/${companyId}/invitations`),
    enabled: Boolean(companyId),
  });
}

export function useCreateInvitation(companyId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { email: string; role: CompanyMemberRole }) =>
      api.post<CreatedInvitation>(
        `/companies/${companyId}/invitations`,
        payload,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: [...INVITATIONS_KEY, companyId],
      });
    },
  });
}

export function useInvitationPreview(token: string | undefined) {
  return useQuery({
    queryKey: ["invitations", "preview", token],
    queryFn: () => api.get<InvitationPreview>(`/invitations/${token}`),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (token: string) =>
      api.post<{ message: string; companyId: string; role: CompanyMemberRole }>(
        "/invitations/accept",
        { token },
      ),
  });
}
