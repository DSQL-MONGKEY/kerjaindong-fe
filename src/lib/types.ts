export type Role = "JOB_SEEKER" | "EMPLOYER" | "SYS_ADMIN";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  isActive: boolean;
  roles: Role[];
  hasSeekerProfile: boolean;
  hasEmployerProfile: boolean;
  employerCompanyId: string | null;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export type RegionLevel = "PROVINCE" | "REGENCY" | "DISTRICT" | "VILLAGE";

export interface Region {
  id: string;
  code: string;
  name: string;
  level: RegionLevel;
  parentId: string | null;
}
