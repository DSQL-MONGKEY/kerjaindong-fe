import { Suspense, lazy } from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RoleRoute from "./components/auth/RoleRoute";
import FullScreenLoader from "./components/common/FullScreenLoader";
import { ScrollToTop } from "./components/common/ScrollToTop";
import AppLayout from "./layout/AppLayout";
import PublicLayout from "./layout/PublicLayout";

// Route-level code splitting: setiap halaman dimuat saat dibutuhkan.
const Home = lazy(() => import("./pages/Home"));
const Jobs = lazy(() => import("./pages/Public/Jobs"));
const JobDetail = lazy(() => import("./pages/Public/JobDetail"));
const CompanyProfile = lazy(() => import("./pages/Public/CompanyProfile"));
const AcceptInvitationPage = lazy(
  () => import("./pages/Invitations/AcceptInvitation"),
);
const SignIn = lazy(() => import("./pages/AuthPages/SignIn"));
const SignUp = lazy(() => import("./pages/AuthPages/SignUp"));
const SeekerDashboard = lazy(() => import("./pages/Dashboard/SeekerDashboard"));
const SeekerProfilePage = lazy(() => import("./pages/Seeker/Profile"));
const SeekerResumesPage = lazy(() => import("./pages/Seeker/Resumes"));
const SeekerApplicationsPage = lazy(
  () => import("./pages/Seeker/Applications"),
);
const SeekerApplicationDetailPage = lazy(
  () => import("./pages/Seeker/ApplicationDetail"),
);
const SeekerSavedJobsPage = lazy(() => import("./pages/Seeker/SavedJobs"));
const SeekerFollowedCompaniesPage = lazy(
  () => import("./pages/Seeker/FollowedCompanies"),
);
const EmployerDashboardPage = lazy(() => import("./pages/Employer/Dashboard"));
const EmployerCompanyPage = lazy(() => import("./pages/Employer/Company"));
const EmployerJobsPage = lazy(() => import("./pages/Employer/Jobs"));
const EmployerJobFormPage = lazy(() => import("./pages/Employer/JobFormPage"));
const EmployerApplicantsPage = lazy(() => import("./pages/Employer/Applicants"));
const EmployerMembersPage = lazy(() => import("./pages/Employer/Members"));
const AdminCompaniesPage = lazy(() => import("./pages/Admin/Companies"));
const AdminUsersPage = lazy(() => import("./pages/Admin/Users"));
const AdminJobsPage = lazy(() => import("./pages/Admin/Jobs"));
const AdminAuditLogsPage = lazy(() => import("./pages/Admin/AuditLogs"));
const NotFound = lazy(() => import("./pages/OtherPage/NotFound"));

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          {/* Publik */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:slug" element={<JobDetail />} />
            <Route path="/companies/:slug" element={<CompanyProfile />} />
            <Route
              path="/invitations/:token"
              element={<AcceptInvitationPage />}
            />
          </Route>

          {/* Auth */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Area terautentikasi */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route element={<RoleRoute allowed={["JOB_SEEKER"]} />}>
                <Route path="/dashboard" element={<SeekerDashboard />} />
                <Route
                  path="/dashboard/profile"
                  element={<SeekerProfilePage />}
                />
                <Route
                  path="/dashboard/resumes"
                  element={<SeekerResumesPage />}
                />
                <Route
                  path="/dashboard/applications"
                  element={<SeekerApplicationsPage />}
                />
                <Route
                  path="/dashboard/applications/:id"
                  element={<SeekerApplicationDetailPage />}
                />
                <Route
                  path="/dashboard/saved-jobs"
                  element={<SeekerSavedJobsPage />}
                />
                <Route
                  path="/dashboard/followed-companies"
                  element={<SeekerFollowedCompaniesPage />}
                />
              </Route>

              <Route element={<RoleRoute allowed={["EMPLOYER"]} />}>
                <Route path="/employer" element={<EmployerDashboardPage />} />
                <Route
                  path="/employer/company"
                  element={<EmployerCompanyPage />}
                />
                <Route path="/employer/jobs" element={<EmployerJobsPage />} />
                <Route
                  path="/employer/jobs/new"
                  element={<EmployerJobFormPage />}
                />
                <Route
                  path="/employer/jobs/:id/edit"
                  element={<EmployerJobFormPage />}
                />
                <Route
                  path="/employer/jobs/:id/applicants"
                  element={<EmployerApplicantsPage />}
                />
                <Route
                  path="/employer/members"
                  element={<EmployerMembersPage />}
                />
              </Route>

              <Route element={<RoleRoute allowed={["SYS_ADMIN"]} />}>
                <Route
                  path="/admin"
                  element={<Navigate to="/admin/companies" replace />}
                />
                <Route
                  path="/admin/companies"
                  element={<AdminCompaniesPage />}
                />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/jobs" element={<AdminJobsPage />} />
                <Route
                  path="/admin/audit-logs"
                  element={<AdminAuditLogsPage />}
                />
              </Route>
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
