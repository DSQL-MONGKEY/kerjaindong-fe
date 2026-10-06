import type {
  EmploymentType,
  ExperienceLevel,
  JobLocation,
  LocationSummary,
  SalaryPeriod,
  VerificationStatus,
  WorkMode,
} from "./job-types";
import type { ApplicationStatus } from "./seeker-types";

export type JobStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "PAUSED"
  | "CLOSED"
  | "ARCHIVED";

export type CompanyMemberRole = "OWNER" | "ADMIN" | "RECRUITER";

export interface CompanyMembership {
  id: string;
  companyRole: CompanyMemberRole;
  firstName: string;
  lastName: string | null;
  position: string | null;
  isActive: boolean;
}

export interface MyCompany {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  industry: string | null;
  description: string | null;
  verification: VerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  location: {
    provinceId: string | null;
    cityId: string | null;
    province: LocationSummary | null;
    city: LocationSummary | null;
  };
  membership: CompanyMembership;
}

export interface EmployerJobSummary {
  id: string;
  title: string;
  slug: string;
  status: JobStatus;
  employmentType: EmploymentType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  salaryPeriod: SalaryPeriod;
  applicationCount: number;
  viewCount: number;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  location: JobLocation;
}

export interface Applicant {
  id: string;
  status: ApplicationStatus;
  coverLetter: string | null;
  viewedAt: string | null;
  statusChangedAt: string | null;
  createdAt: string;
  applicant: {
    fullName: string;
    headline: string | null;
    phone: string | null;
    email: string;
    expectedSalary: number | null;
    location: LocationSummary | null;
  };
}

export interface Member {
  id: string;
  userId: string;
  firstName: string;
  lastName: string | null;
  position: string | null;
  companyRole: CompanyMemberRole;
  isActive: boolean;
  joinedAt: string;
  user: { email: string; username: string; fullName: string | null };
}

export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED";

export interface Invitation {
  id: string;
  email: string;
  role: CompanyMemberRole;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
  status: InvitationStatus;
}

export interface CreatedInvitation {
  id: string;
  email: string;
  role: CompanyMemberRole;
  expiresAt: string;
  token: string;
}

export interface InvitationPreview {
  company: { name: string; slug: string };
  email: string;
  role: CompanyMemberRole;
  expiresAt: string;
  status: InvitationStatus;
}
