import { api } from "@/lib/http";
import type {
  CompanyPublic,
  EmploymentType,
  ExperienceLevel,
  JobCard,
  JobDetail,
  Paginated,
  WorkMode,
} from "@/lib/job-types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export interface JobFilters {
  q?: string;
  provinceId?: string;
  cityId?: string;
  companyId?: string;
  employmentType?: EmploymentType;
  workMode?: WorkMode;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
}

export function usePublicJobs(
  filters: JobFilters,
  options?: { enabled?: boolean; limit?: number },
) {
  const limit = options?.limit ?? 9;

  return useInfiniteQuery({
    queryKey: ["jobs", "public", filters, limit],
    queryFn: ({ pageParam }) =>
      api.get<Paginated<JobCard>>("/jobs", {
        query: {
          ...filters,
          limit,
          cursor: pageParam ?? undefined,
        },
      }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: options?.enabled ?? true,
  });
}

export function useJobDetail(slug?: string) {
  return useQuery({
    queryKey: ["jobs", "detail", slug],
    queryFn: () => api.get<JobDetail>(`/jobs/${slug}`),
    enabled: Boolean(slug),
  });
}

export function usePublicCompany(slug?: string) {
  return useQuery({
    queryKey: ["companies", "public", slug],
    queryFn: () => api.get<CompanyPublic>(`/companies/${slug}`),
    enabled: Boolean(slug),
  });
}
