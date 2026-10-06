import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import RegionCascade from "@/components/seeker/RegionCascade";
import type { JobPayload } from "@/hooks/useEmployer";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type FormValues = {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  employmentType: string;
  workMode: string;
  experienceLevel: string;
  provinceId: string;
  cityId: string;
  salaryMin: string;
  salaryMax: string;
  salaryPeriod: string;
  expiresAt: string;
};

export interface JobFormInitial {
  title?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  employmentType?: string;
  workMode?: string;
  experienceLevel?: string;
  provinceId?: string;
  cityId?: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryPeriod?: string;
  expiresAt?: string | null;
}

interface JobFormProps {
  initial?: JobFormInitial;
  submitLabel: string;
  onSubmit: (payload: JobPayload) => Promise<void>;
}

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
];

const workModes = ["ONSITE", "REMOTE", "HYBRID"];
const experienceLevels = ["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"];
const salaryPeriods = ["HOURLY", "DAILY", "MONTHLY", "YEARLY"];

const selectClass =
  "h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800";

export default function JobForm({ initial, submitLabel, onSubmit }: JobFormProps) {
  const { t } = useTranslation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const schema = z
    .object({
      title: z.string().trim().min(3, t("employer.jobForm.titleRequired")),
      description: z.string().trim().min(1, t("employer.jobForm.descriptionRequired")),
      requirements: z.string(),
      benefits: z.string(),
      employmentType: z.string().min(1, t("employer.jobForm.typeRequired")),
      workMode: z.string(),
      experienceLevel: z.string(),
      provinceId: z.string(),
      cityId: z.string(),
      salaryMin: z.string(),
      salaryMax: z.string(),
      salaryPeriod: z.string(),
      expiresAt: z.string(),
    })
    .refine(
      (values) => {
        const min = Number(values.salaryMin);
        const max = Number(values.salaryMax);
        return !(min > 0 && max > 0 && max < min);
      },
      { path: ["salaryMax"], message: t("employer.jobForm.salaryInvalid") },
    );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initial?.title ?? "",
      description: initial?.description ?? "",
      requirements: initial?.requirements ?? "",
      benefits: initial?.benefits ?? "",
      employmentType: initial?.employmentType ?? "FULL_TIME",
      workMode: initial?.workMode ?? "ONSITE",
      experienceLevel: initial?.experienceLevel ?? "",
      provinceId: initial?.provinceId ?? "",
      cityId: initial?.cityId ?? "",
      salaryMin: initial?.salaryMin?.toString() ?? "",
      salaryMax: initial?.salaryMax?.toString() ?? "",
      salaryPeriod: initial?.salaryPeriod ?? "MONTHLY",
      expiresAt: initial?.expiresAt ? initial.expiresAt.slice(0, 10) : "",
    },
  });

  const provinceId = watch("provinceId");
  const cityId = watch("cityId");

  const handleFormSubmit = async (values: FormValues) => {
    setErrorMessage(null);

    const salaryMin = Number(values.salaryMin);
    const salaryMax = Number(values.salaryMax);

    const payload: JobPayload = {
      title: values.title,
      description: values.description,
      ...(values.requirements ? { requirements: values.requirements } : {}),
      ...(values.benefits ? { benefits: values.benefits } : {}),
      employmentType: values.employmentType,
      workMode: values.workMode,
      ...(values.experienceLevel
        ? { experienceLevel: values.experienceLevel }
        : {}),
      ...(values.provinceId ? { provinceId: values.provinceId } : {}),
      ...(values.cityId ? { cityId: values.cityId } : {}),
      ...(salaryMin > 0 ? { salaryMin } : {}),
      ...(salaryMax > 0 ? { salaryMax } : {}),
      salaryPeriod: values.salaryPeriod,
      ...(values.expiresAt
        ? { expiresAt: new Date(`${values.expiresAt}T00:00:00.000Z`).toISOString() }
        : {}),
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t("errors.generic"),
      );
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="title">
          {t("employer.jobForm.title")} <span className="text-error-500">*</span>
        </Label>
        <Input
          id="title"
          error={Boolean(errors.title)}
          hint={errors.title?.message}
          {...register("title")}
        />
      </div>

      <div>
        <Label htmlFor="description">
          {t("employer.jobForm.description")}{" "}
          <span className="text-error-500">*</span>
        </Label>
        <textarea
          id="description"
          rows={5}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          {...register("description")}
        />
        {errors.description ? (
          <p className="mt-1.5 text-xs text-error-500">
            {errors.description.message}
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="requirements">
            {t("employer.jobForm.requirements")}
          </Label>
          <textarea
            id="requirements"
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            {...register("requirements")}
          />
        </div>
        <div>
          <Label htmlFor="benefits">{t("employer.jobForm.benefits")}</Label>
          <textarea
            id="benefits"
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            {...register("benefits")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="employmentType">
            {t("employer.jobForm.employmentType")}
          </Label>
          <select
            id="employmentType"
            className={selectClass}
            {...register("employmentType")}
          >
            {employmentTypes.map((type) => (
              <option key={type} value={type}>
                {t(`jobs.employmentType.${type}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="workMode">{t("employer.jobForm.workMode")}</Label>
          <select
            id="workMode"
            className={selectClass}
            {...register("workMode")}
          >
            {workModes.map((mode) => (
              <option key={mode} value={mode}>
                {t(`jobs.workMode.${mode}`)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="experienceLevel">
            {t("employer.jobForm.experienceLevel")}
          </Label>
          <select
            id="experienceLevel"
            className={selectClass}
            {...register("experienceLevel")}
          >
            <option value="">{t("employer.jobForm.experienceLevelNone")}</option>
            {experienceLevels.map((level) => (
              <option key={level} value={level}>
                {t(`jobs.experienceLevel.${level}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="salaryMin">{t("employer.jobForm.salaryMin")}</Label>
          <Input
            id="salaryMin"
            type="number"
            min={0}
            step={1000}
            {...register("salaryMin")}
          />
        </div>
        <div>
          <Label htmlFor="salaryMax">{t("employer.jobForm.salaryMax")}</Label>
          <Input
            id="salaryMax"
            type="number"
            min={0}
            step={1000}
            error={Boolean(errors.salaryMax)}
            hint={errors.salaryMax?.message}
            {...register("salaryMax")}
          />
        </div>
        <div>
          <Label htmlFor="salaryPeriod">
            {t("employer.jobForm.salaryPeriod")}
          </Label>
          <select
            id="salaryPeriod"
            className={selectClass}
            {...register("salaryPeriod")}
          >
            {salaryPeriods.map((period) => (
              <option key={period} value={period}>
                {t(`jobs.salaryPeriod.${period}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="expiresAt">{t("employer.jobForm.expiresAt")}</Label>
          <Input id="expiresAt" type="date" {...register("expiresAt")} />
        </div>
      </div>

      <RegionCascade
        provinceId={provinceId}
        cityId={cityId}
        onChange={(next) => {
          setValue("provinceId", next.provinceId);
          setValue("cityId", next.cityId);
        }}
      />

      {errorMessage ? (
        <p className="rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
          {errorMessage}
        </p>
      ) : null}

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? t("common.loading") : submitLabel}
      </Button>
    </form>
  );
}
