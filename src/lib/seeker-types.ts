import type {
  JobCard,
  JobCompanySummary,
  JobLocation,
  LocationSummary,
  VerificationStatus,
} from "./job-types";

export type ApplicationStatus =
  | "APPLIED"
  | "REVIEWING"
  | "SHORTLISTED"
  | "REJECTED"
  | "ACCEPTED"
  | "WITHDRAWN";

export interface SeekerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string | null;
  headline: string | null;
  summary: string | null;
  phone: string | null;
  photoKey: string | null;
  expectedSalary: number | null;
  salaryCurrency: string;
  openToWork: boolean;
  createdAt: string;
  updatedAt: string;
  location: {
    provinceId: string | null;
    cityId: string | null;
    province: LocationSummary | null;
    city: LocationSummary | null;
  };
}

export interface Resume {
  id: string;
  jobSeekerId: string;
  title: string;
  isPrimary: boolean;
  summary: string | null;
  fileKey: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationJobRef {
  id: string;
  title: string;
  slug: string;
  status: string;
  company: JobCompanySummary;
}

export interface ApplicationSummary {
  id: string;
  status: ApplicationStatus;
  viewedAt: string | null;
  statusChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
  job: ApplicationJobRef;
}

export interface ApplicationHistoryEntry {
  fromStatus: ApplicationStatus | null;
  toStatus: ApplicationStatus;
  note: string | null;
  changedById: string | null;
  createdAt: string;
}

export interface ApplicationDetail {
  id: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  resumeId: string | null;
  resumeSnapshot: unknown;
  viewedAt: string | null;
  statusChangedAt: string | null;
  createdAt: string;
  updatedAt: string;
  job: ApplicationJobRef;
  history: ApplicationHistoryEntry[];
}

export interface SavedJobItem extends JobCard {
  status: string;
  savedAt: string;
}

export interface FollowedCompanyItem {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  verification: VerificationStatus;
  followedAt: string;
  location: JobLocation;
}

export interface PaginatedMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginatedMeta;
}
