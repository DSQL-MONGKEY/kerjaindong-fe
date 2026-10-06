import { api } from "@/lib/http";
import type {
  FollowedCompanyItem,
  PaginatedResult,
  SavedJobItem,
} from "@/lib/seeker-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const SAVED_KEY = ["saved-jobs"] as const;
const FOLLOWED_KEY = ["followed-companies"] as const;

export function useSavedJobs(page = 1) {
  return useQuery({
    queryKey: [...SAVED_KEY, { page }],
    queryFn: () =>
      api.get<PaginatedResult<SavedJobItem>>("/saved-jobs", {
        query: { page, perPage: 10 },
      }),
  });
}

export function useSaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => api.post(`/jobs/${jobId}/save`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SAVED_KEY });
    },
  });
}

export function useUnsaveJob() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => api.delete(`/jobs/${jobId}/save`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: SAVED_KEY });
    },
  });
}

export function useFollowedCompanies(page = 1) {
  return useQuery({
    queryKey: [...FOLLOWED_KEY, { page }],
    queryFn: () =>
      api.get<PaginatedResult<FollowedCompanyItem>>("/followed-companies", {
        query: { page, perPage: 10 },
      }),
  });
}

export function useFollowCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => api.post(`/companies/${companyId}/follow`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FOLLOWED_KEY });
    },
  });
}

export function useUnfollowCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => api.delete(`/companies/${companyId}/follow`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: FOLLOWED_KEY });
    },
  });
}
