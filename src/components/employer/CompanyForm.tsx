import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import RegionCascade from "@/components/seeker/RegionCascade";
import { useAuth } from "@/context/AuthContext";
import {
  useCreateCompany,
  useUpdateCompany,
  type CompanyPayload,
} from "@/hooks/useEmployer";
import { ApiError } from "@/lib/http";
import type { MyCompany } from "@/lib/employer-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type FormValues = {
  name: string;
  website: string;
  industry: string;
  description: string;
  firstName: string;
  lastName: string;
  position: string;
  provinceId: string;
  cityId: string;
};

export default function CompanyForm({ company }: { company: MyCompany | null }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Prefill nama owner dari akun agar field wajib tidak mudah kosong.
  const nameParts = (user?.fullName ?? "").trim().split(/\s+/).filter(Boolean);
  const defaultOwnerFirstName = nameParts[0] ?? "";
  const defaultOwnerLastName = nameParts.slice(1).join(" ");

  const schema = z
    .object({
      name: z.string().trim().min(2, t("employer.company.nameRequired")),
      website: z.string().trim(),
      industry: z.string().trim().max(100),
      description: z.string().max(5000),
      firstName: z.string().trim(),
      lastName: z.string().trim(),
      position: z.string().trim(),
      provinceId: z.string(),
      cityId: z.string(),
    })
    .refine((values) => Boolean(company) || values.firstName.length > 0, {
      path: ["firstName"],
      message: t("employer.company.ownerNameRequired"),
    });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: company?.name ?? "",
      website: company?.website ?? "",
      industry: company?.industry ?? "",
      description: company?.description ?? "",
      firstName: company?.membership.firstName ?? defaultOwnerFirstName,
      lastName: company?.membership.lastName ?? defaultOwnerLastName,
      position: company?.membership.position ?? "",
      provinceId: company?.location.provinceId ?? "",
      cityId: company?.location.cityId ?? "",
    },
  });

  const provinceId = watch("provinceId");
  const cityId = watch("cityId");

  const onSubmit = async (values: FormValues) => {
    setSaved(false);
    setErrorMessage(null);

    const payload: CompanyPayload = {
      name: values.name,
      ...(values.website ? { website: values.website } : {}),
      ...(values.industry ? { industry: values.industry } : {}),
      ...(values.description ? { description: values.description } : {}),
      ...(values.provinceId ? { provinceId: values.provinceId } : {}),
      ...(values.cityId ? { cityId: values.cityId } : {}),
      ...(!company && values.firstName ? { firstName: values.firstName } : {}),
      ...(!company && values.lastName ? { lastName: values.lastName } : {}),
      ...(!company && values.position ? { position: values.position } : {}),
    };

    try {
      if (company) {
        await updateMutation.mutateAsync(payload);
      } else {
        await createMutation.mutateAsync(payload);
      }
      setSaved(true);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">
            {t("employer.company.name")} <span className="text-error-500">*</span>
          </Label>
          <Input
            id="name"
            error={Boolean(errors.name)}
            hint={errors.name?.message}
            {...register("name")}
          />
        </div>
        <div>
          <Label htmlFor="industry">{t("employer.company.industry")}</Label>
          <Input id="industry" {...register("industry")} />
        </div>
      </div>

      <div>
        <Label htmlFor="website">{t("employer.company.website")}</Label>
        <Input
          id="website"
          placeholder="https://"
          {...register("website")}
        />
      </div>

      <div>
        <Label htmlFor="description">{t("employer.company.description")}</Label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          {...register("description")}
        />
      </div>

      {!company ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="firstName">
              {t("employer.company.ownerFirstName")}{" "}
              <span className="text-error-500">*</span>
            </Label>
            <Input
              id="firstName"
              error={Boolean(errors.firstName)}
              hint={errors.firstName?.message}
              {...register("firstName")}
            />
          </div>
          <div>
            <Label htmlFor="lastName">
              {t("employer.company.ownerLastName")}
            </Label>
            <Input id="lastName" {...register("lastName")} />
          </div>
          <div>
            <Label htmlFor="position">{t("employer.company.ownerPosition")}</Label>
            <Input id="position" {...register("position")} />
          </div>
        </div>
      ) : null}

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

      {saved ? (
        <p className="rounded-lg bg-success-50 px-4 py-3 text-theme-sm text-success-600 dark:bg-success-500/10 dark:text-success-400">
          {t("employer.company.saved")}
        </p>
      ) : null}

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? t("common.loading") : t("common.save")}
      </Button>
    </form>
  );
}
