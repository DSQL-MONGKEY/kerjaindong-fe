import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { SkeletonForm } from "@/components/ui/skeleton/Skeleton";
import JobForm, {
  type JobFormInitial,
} from "@/components/employer/JobForm";
import {
  useCreateJob,
  useManagedJob,
  useMyCompany,
  useUpdateJob,
  type JobPayload,
} from "@/hooks/useEmployer";
import { useTranslation } from "react-i18next";
import { Navigate, useNavigate, useParams } from "react-router";

export default function EmployerJobFormPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const companyQuery = useMyCompany();
  const managedQuery = useManagedJob(isEdit ? id : undefined);
  const createMutation = useCreateJob(companyQuery.data?.id);
  const updateMutation = useUpdateJob(id);

  if (companyQuery.isPending || (isEdit && managedQuery.isPending)) {
    return <SkeletonForm fields={6} />;
  }

  if (!companyQuery.data) {
    return <Navigate to="/employer/company" replace />;
  }

  const initial: JobFormInitial | undefined = managedQuery.data
    ? {
        title: managedQuery.data.title,
        description: managedQuery.data.description,
        requirements: managedQuery.data.requirements ?? "",
        benefits: managedQuery.data.benefits ?? "",
        employmentType: managedQuery.data.employmentType,
        workMode: managedQuery.data.workMode,
        experienceLevel: managedQuery.data.experienceLevel ?? "",
        provinceId: managedQuery.data.location.province?.id ?? "",
        cityId: managedQuery.data.location.city?.id ?? "",
        salaryMin: managedQuery.data.salaryMin,
        salaryMax: managedQuery.data.salaryMax,
        salaryPeriod: managedQuery.data.salaryPeriod,
        expiresAt: managedQuery.data.expiresAt,
      }
    : undefined;

  const handleSubmit = async (payload: JobPayload) => {
    if (isEdit) {
      await updateMutation.mutateAsync(payload);
    } else {
      await createMutation.mutateAsync(payload);
    }
    navigate("/employer/jobs");
  };

  return (
    <>
      <PageMeta
        title={t("employer.jobForm.metaTitle")}
        description={t("employer.jobForm.metaDescription")}
      />
      <PageBreadCrumb
        pageTitle={
          isEdit ? t("employer.jobForm.editTitle") : t("employer.jobForm.title")
        }
      />

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        <JobForm
          initial={initial}
          submitLabel={
            isEdit ? t("common.save") : t("employer.jobForm.create")
          }
          onSubmit={handleSubmit}
        />
      </div>
    </>
  );
}
