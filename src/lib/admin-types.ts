import type { EmployerJobSummary, JobStatus } from "./employer-types";
import type { LocationSummary, VerificationStatus } from "./job-types";
import type { Role } from "./types";

export interface AdminCompany {
  id: string;
  name: string;
  slug: string;
  industry: string | null;
  verification: VerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
  location: { province: LocationSummary | null; city: LocationSummary | null };
  _count: { jobPosts: number; employers: number };
}

export interface AdminUser {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  roles: Role[];
}

export interface AdminAuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string | null;
  before: unknown;
  after: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
  actor: { id: string; username: string; email: string } | null;
}

export interface AdminJob {
  id: string;
  title: string;
  slug: string;
  status: JobStatus;
  applicationCount: number;
  viewCount: number;
  publishedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  company: { id: string; name: string; slug: string };
}

export type AdminJobSummary = EmployerJobSummary & AdminJob;
