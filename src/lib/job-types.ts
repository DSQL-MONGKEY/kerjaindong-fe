import type { RegionLevel } from "./types";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERNSHIP"
  | "FREELANCE";

export type WorkMode = "ONSITE" | "REMOTE" | "HYBRID";

export type ExperienceLevel = "ENTRY" | "JUNIOR" | "MID" | "SENIOR" | "LEAD";

export type SalaryPeriod = "HOURLY" | "DAILY" | "MONTHLY" | "YEARLY";

export type VerificationStatus =
  | "UNVERIFIED"
  | "PENDING"
  | "VERIFIED"
  | "REJECTED";

export interface LocationSummary {
  id: string;
  code: string;
  name: string;
  level: RegionLevel;
}

export interface JobLocation {
  province: LocationSummary | null;
  city: LocationSummary | null;
}

export interface JobCompanySummary {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  verification: VerificationStatus;
}

export interface JobCard {
  id: string;
  title: string;
  slug: string;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: SalaryPeriod;
  publishedAt: string | null;
  createdAt: string;
  company: JobCompanySummary;
  location: JobLocation;
}

export interface JobDetail extends JobCard {
  companyId: string;
  description: string;
  requirements: string | null;
  benefits: string | null;
  status: string;
  expiresAt: string | null;
  closedAt: string | null;
  viewCount: number;
  applicationCount: number;
  updatedAt: string;
  company: JobCompanySummary & {
    website: string | null;
    description: string | null;
  };
}

export interface Paginated<T> {
  items: T[];
  nextCursor: string | null;
}

export interface CompanyPublic {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  verification: VerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
  location: {
    provinceId: string | null;
    cityId: string | null;
    province: LocationSummary | null;
    city: LocationSummary | null;
  };
}
