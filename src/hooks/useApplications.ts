import { api } from "@/lib/http";
import type {
  ApplicationDetail,
  ApplicationStatus,
  ApplicationSummary,
  PaginatedResult,
} from "@/lib/seeker-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const APPLICATIONS_KEY = ["applications"] as const;

export function useMyApplications(status?: ApplicationStatus, page = 1) {
  return useQuery({
    queryKey: [...APPLICATIONS_KEY, "me", { status: status ?? null, page }],
    queryFn: () =>
      api.get<PaginatedResult<ApplicationSummary>>("/applications/me", {
        query: { status, page, perPage: 10 },
      }),
  });
}

export function useApplicationDetail(id?: string) {
  return useQuery({
    queryKey: [...APPLICATIONS_KEY, "detail", id],
    queryFn: () => api.get<ApplicationDetail>(`/applications/${id}`),
    enabled: Boolean(id),
  });
}

export interface ApplyPayload {
  resumeId?: string;
  coverLetter?: string;
}

export function useApplyJob(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ApplyPayload) =>
      api.post<ApplicationDetail>(`/jobs/${jobId}/applications`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api.post<ApplicationDetail>(`/applications/${id}/withdraw`),
    onSuccess: (application) => {
      queryClient.setQueryData(
        [...APPLICATIONS_KEY, "detail", application.id],
        application,
      );
      void queryClient.invalidateQueries({ queryKey: APPLICATIONS_KEY });
    },
  });
}
