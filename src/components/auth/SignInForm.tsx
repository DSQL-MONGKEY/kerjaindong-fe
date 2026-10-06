import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { homePathForRoles, useAuth } from "@/context/AuthContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import { ApiError } from "@/lib/http";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router";
import { z } from "zod";

type FormValues = {
  identifier: string;
  password: string;
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const schema = z.object({
    identifier: z
      .string()
      .trim()
      .min(1, t("auth.errors.identifierRequired")),
    password: z.string().min(1, t("auth.errors.passwordRequired")),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const user = await login(values.identifier, values.password);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from ?? homePathForRoles(user.roles), { replace: true });
    } catch (error) {
      setError("root", {
        message:
          error instanceof ApiError ? error.message : t("errors.generic"),
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto w-full max-w-md pt-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5 rtl:rotate-180" />
          {t("auth.backHome")}
        </Link>
      </div>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div className="mb-5 sm:mb-8">
          <h1 className="mb-2 text-title-sm font-semibold text-gray-800 sm:text-title-md dark:text-white/90">
            {t("auth.signIn.title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("auth.signIn.subtitle")}
          </p>
        </div>

        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <div className="space-y-6">
            <div>
              <Label htmlFor="identifier">
                {t("auth.fields.emailOrUsername")}{" "}
                <span className="text-error-500">*</span>
              </Label>
              <Input
                id="identifier"
                placeholder={t("auth.fields.emailOrUsernamePlaceholder")}
                error={Boolean(errors.identifier)}
                hint={errors.identifier?.message}
                autoComplete="username"
                {...register("identifier")}
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
                  placeholder={t("auth.fields.passwordPlaceholder")}
                  error={Boolean(errors.password)}
                  hint={errors.password?.message}
                  autoComplete="current-password"
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
                  ? t("auth.signIn.submitting")
                  : t("auth.signIn.submit")}
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-5">
          <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
            {t("auth.signIn.noAccount")}{" "}
            <Link
              to="/signup"
              className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
            >
              {t("auth.signUp.submit")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
