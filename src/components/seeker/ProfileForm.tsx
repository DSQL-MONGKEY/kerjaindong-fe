import RegionCascade from "@/components/seeker/RegionCascade";
import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import {
  useCreateSeekerProfile,
  useUpdateSeekerProfile,
  type SeekerProfilePayload,
} from "@/hooks/useSeeker";
import { ApiError } from "@/lib/http";
import type { SeekerProfile } from "@/lib/seeker-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";

type FormValues = {
  firstName: string;
  lastName: string;
  headline: string;
  summary: string;
  phone: string;
  expectedSalary: string;
  provinceId: string;
  cityId: string;
  openToWork: boolean;
};

export default function ProfileForm({
  profile,
}: {
  profile: SeekerProfile | null;
}) {
  const { t } = useTranslation();
  const createMutation = useCreateSeekerProfile();
  const updateMutation = useUpdateSeekerProfile();
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const schema = z.object({
    firstName: z.string().trim().min(1, t("seeker.errors.firstNameRequired")),
    lastName: z.string().trim().max(100),
    headline: z.string().trim().max(255),
    summary: z.string().max(5000),
    phone: z.string().trim().max(30),
    expectedSalary: z.string(),
    provinceId: z.string(),
    cityId: z.string(),
    openToWork: z.boolean(),
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
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      headline: profile?.headline ?? "",
      summary: profile?.summary ?? "",
      phone: profile?.phone ?? "",
      expectedSalary: profile?.expectedSalary?.toString() ?? "",
      provinceId: profile?.location.provinceId ?? "",
      cityId: profile?.location.cityId ?? "",
      openToWork: profile?.openToWork ?? true,
    },
  });

  const openToWork = watch("openToWork");
  const provinceId = watch("provinceId");
  const cityId = watch("cityId");

  const onSubmit = async (values: FormValues) => {
    setSaved(false);
    setErrorMessage(null);

    const expectedSalary = Number(values.expectedSalary);
    const payload: SeekerProfilePayload = {
      firstName: values.firstName,
      ...(values.lastName ? { lastName: values.lastName } : {}),
      ...(values.headline ? { headline: values.headline } : {}),
      ...(values.summary ? { summary: values.summary } : {}),
      ...(values.phone ? { phone: values.phone } : {}),
      ...(values.provinceId ? { provinceId: values.provinceId } : {}),
      ...(values.cityId ? { cityId: values.cityId } : {}),
      ...(expectedSalary > 0 ? { expectedSalary } : {}),
      openToWork: values.openToWork,
    };

    try {
      if (profile) {
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
    <form
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">
            {t("seeker.profile.firstName")}{" "}
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
          <Label htmlFor="lastName">{t("seeker.profile.lastName")}</Label>
          <Input id="lastName" {...register("lastName")} />
        </div>
      </div>

      <div>
        <Label htmlFor="headline">{t("seeker.profile.headline")}</Label>
        <Input
          id="headline"
          placeholder={t("seeker.profile.headlinePlaceholder")}
          {...register("headline")}
        />
      </div>

      <div>
        <Label htmlFor="summary">{t("seeker.profile.summary")}</Label>
        <textarea
          id="summary"
          rows={4}
          className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          placeholder={t("seeker.profile.summaryPlaceholder")}
          {...register("summary")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">{t("seeker.profile.phone")}</Label>
          <Input id="phone" {...register("phone")} />
        </div>
        <div>
          <Label htmlFor="expectedSalary">
            {t("seeker.profile.expectedSalary")}
          </Label>
          <Input
            id="expectedSalary"
            type="number"
            min={0}
            step={500000}
            placeholder="5000000"
            {...register("expectedSalary")}
          />
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

      <label className="flex items-center gap-3">
        <Checkbox
          checked={openToWork}
          onChange={(checked) => setValue("openToWork", checked)}
        />
        <span className="text-theme-sm text-gray-700 dark:text-gray-400">
          {t("seeker.profile.openToWork")}
        </span>
      </label>

      {errorMessage ? (
        <p className="rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
          {errorMessage}
        </p>
      ) : null}

      {saved ? (
        <p className="rounded-lg bg-success-50 px-4 py-3 text-theme-sm text-success-600 dark:bg-success-500/10 dark:text-success-400">
          {t("seeker.profile.saved")}
        </p>
      ) : null}

      <div>
        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? t("common.loading")
            : profile
              ? t("seeker.profile.save")
              : t("seeker.profile.create")}
        </Button>
      </div>
    </form>
  );
}
