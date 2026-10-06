import { api } from "@/lib/http";
import type { Resume, SeekerProfile } from "@/lib/seeker-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface SeekerProfilePayload {
  firstName: string;
  lastName?: string;
  headline?: string;
  summary?: string;
  phone?: string;
  provinceId?: string;
  cityId?: string;
  expectedSalary?: number;
  salaryCurrency?: string;
  openToWork?: boolean;
}

const PROFILE_KEY = ["seeker-profile", "me"] as const;
const RESUMES_KEY = ["resumes"] as const;

export function useSeekerProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => api.get<SeekerProfile>("/seeker-profile/me"),
    retry: false,
  });
}

export function useCreateSeekerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SeekerProfilePayload) =>
      api.post<SeekerProfile>("/seeker-profile", payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_KEY, profile);
    },
  });
}

export function useUpdateSeekerProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<SeekerProfilePayload>) =>
      api.patch<SeekerProfile>("/seeker-profile/me", payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(PROFILE_KEY, profile);
    },
  });
}

export function useResumes() {
  return useQuery({
    queryKey: RESUMES_KEY,
    queryFn: () => api.get<Resume[]>("/resumes"),
  });
}

export interface ResumePayload {
  title: string;
  summary?: string;
  isPrimary?: boolean;
}

export function useCreateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ResumePayload) =>
      api.post<Resume>("/resumes", payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
    },
  });
}

export function useUpdateResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: ResumePayload & { id: string }) =>
      api.patch<Resume>(`/resumes/${id}`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
    },
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.delete(`/resumes/${id}`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
    },
  });
}

export function useSetPrimaryResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.post<Resume>(`/resumes/${id}/primary`),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: RESUMES_KEY });
    },
  });
}
