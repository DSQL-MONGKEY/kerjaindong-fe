import Label from "@/components/form/Label";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { homePathForRoles, useAuth } from "@/context/AuthContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { ApiError } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

type RegistrationRole = "JOB_SEEKER" | "EMPLOYER";

type FormValues = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<RegistrationRole>("JOB_SEEKER");
  const [agreed, setAgreed] = useState(false);
  const [agreeError, setAgreeError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const schema = z.object({
    fullName: z.string().trim().min(1, t("auth.errors.fullNameRequired")),
    username: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9._-]{3,50}$/, t("auth.errors.usernameInvalid")),
    email: z.string().trim().toLowerCase().email(t("auth.errors.emailInvalid")),
    password: z
      .string()
      .min(8, t("auth.errors.passwordMin"))
      .max(128, t("auth.errors.passwordMax"))
      .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, t("auth.errors.passwordPattern")),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", username: "", email: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    if (!agreed) {
      setAgreeError(t("auth.errors.agreementRequired"));
      return;
    }

    setAgreeError(null);

    try {
      const user = await registerUser({ ...values, role });
      navigate(homePathForRoles(user.roles), { replace: true });
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError ? error.message : t("errors.generic"),
      });
    }
  };

  const roleOptions: { value: RegistrationRole; label: string }[] = [
    { value: "JOB_SEEKER", label: t("auth.signUp.roleSeeker") },
    { value: "EMPLOYER", label: t("auth.signUp.roleEmployer") },
  ];

  return (
    <div className="no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2">
      <div className="mx-auto mb-5 w-full max-w-md sm:pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          {t("auth.backHome")}
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center pb-10">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
            {t("auth.signUp.title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("auth.signUp.subtitle")}
          </p>
        </div>

        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <div className="space-y-6">
            <div>
              <Label>{t("auth.signUp.roleLabel")}</Label>
              <div className="grid grid-cols-2 gap-3">
                {roleOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setRole(option.value)}
                    className={`rounded-lg border px-4 py-3 text-theme-sm font-medium transition ${
                      role === option.value
                        ? "border-brand-500 bg-brand-50 text-brand-600 dark:border-brand-500 dark:bg-brand-500/15 dark:text-brand-400"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-white/3"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="fullName">
                {t("auth.fields.fullName")}{" "}
                <span className="text-error-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder={t("auth.fields.fullNamePlaceholder")}
                error={Boolean(errors.fullName)}
                hint={errors.fullName?.message}
                autoComplete="name"
                {...register("fullName")}
              />
            </div>

            <div>
              <Label htmlFor="username">
                {t("auth.fields.username")}{" "}
                <span className="text-error-500">*</span>
              </Label>
              <Input
                id="username"
                placeholder={t("auth.fields.usernamePlaceholder")}
                error={Boolean(errors.username)}
                hint={errors.username?.message}
                autoComplete="username"
                {...register("username")}
              />
            </div>

            <div>
              <Label htmlFor="email">
                {t("auth.fields.email")}{" "}
                <span className="text-error-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.fields.emailPlaceholder")}
                error={Boolean(errors.email)}
                hint={errors.email?.message}
                autoComplete="email"
                {...register("email")}
              />
            </div>

            <div>
              <Label htmlFor="password">
                {t("auth.fields.password")}{" "}
                <span className="text-error-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.fields.passwordCreatePlaceholder")}
                  error={Boolean(errors.password)}
                  hint={errors.password?.message}
                  autoComplete="new-password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? t("auth.fields.hidePassword")
                      : t("auth.fields.showPassword")
                  }
                  className="absolute inset-e-4 top-1/2 z-30 -translate-y-1/2 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeIcon
                      aria-hidden="true"
                      className="size-5 fill-gray-500 dark:fill-gray-400"
                    />
                  ) : (
                    <EyeCloseIcon
                      aria-hidden="true"
                      className="size-5 fill-gray-500 dark:fill-gray-400"
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="flex items-start gap-3">
                <Checkbox
                  checked={agreed}
                  onChange={(checked) => {
                    setAgreed(checked);
                    if (checked) setAgreeError(null);
                  }}
                />
                <span className="text-theme-sm font-normal text-gray-500 dark:text-gray-400">
                  {t("auth.signUp.agreement")}
                </span>
              </label>
              {agreeError ? (
                <p className="mt-1.5 text-xs text-error-500">{agreeError}</p>
              ) : null}
            </div>

            {errors.root?.message ? (
              <p className="rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                {errors.root.message}
              </p>
            ) : null}

            <div>
              <Button
                type="submit"
                className="w-full"
                size="sm"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? t("auth.signUp.submitting")
                  : t("auth.signUp.submit")}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
            {t("auth.signUp.haveAccount")}{" "}
            <Link
              to="/signin"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              {t("auth.signIn.submit")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
