import PageBreadCrumb from "@/components/common/PageBreadCrumb";
import PageMeta from "@/components/common/PageMeta";
import { ApiError } from "@/lib/http";
import type { Resume } from "@/lib/seeker-types";
import {
  useCreateResume,
  useDeleteResume,
  useResumes,
  useSetPrimaryResume,
  useUpdateResume,
} from "@/hooks/useSeeker";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface ResumeFormState {
  id?: string;
  title: string;
  summary: string;
  isPrimary: boolean;
}

const EMPTY_FORM: ResumeFormState = {
  title: "",
  summary: "",
  isPrimary: false,
};

export default function SeekerResumesPage() {
  const { t } = useTranslation();
  const resumesQuery = useResumes();
  const createMutation = useCreateResume();
  const updateMutation = useUpdateResume();
  const deleteMutation = useDeleteResume();
  const primaryMutation = useSetPrimaryResume();

  const [form, setForm] = useState<ResumeFormState | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resumes = resumesQuery.data ?? [];

  const openCreate = () => {
    setErrorMessage(null);
    setForm({ ...EMPTY_FORM });
  };

  const openEdit = (resume: Resume) => {
    setErrorMessage(null);
    setForm({
      id: resume.id,
      title: resume.title,
      summary: resume.summary ?? "",
      isPrimary: resume.isPrimary,
    });
  };

  const handleSubmit = async () => {
    if (!form || !form.title.trim()) {
      setErrorMessage(t("seeker.resumes.titleRequired"));
      return;
    }

    setErrorMessage(null);

    const payload = {
      title: form.title.trim(),
      ...(form.summary.trim() ? { summary: form.summary.trim() } : {}),
      isPrimary: form.isPrimary,
    };

    try {
      if (form.id) {
        await updateMutation.mutateAsync({ id: form.id, ...payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setForm(null);
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError ? error.message : t("errors.generic"),
      );
    }
  };

  const handleDelete = async (resume: Resume) => {
    if (!window.confirm(t("seeker.resumes.confirmDelete"))) return;
    await deleteMutation.mutateAsync(resume.id).catch(() => undefined);
  };

  return (
    <>
      <PageMeta
        title={t("seeker.resumes.metaTitle")}
        description={t("seeker.resumes.metaDescription")}
      />
      <PageBreadCrumb pageTitle={t("seeker.resumes.title")} />

      <div className="mb-6 flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
        >
          {t("seeker.resumes.add")}
        </button>
      </div>

      {form ? (
        <div className="mb-6 rounded-2xl border border-brand-200 bg-white p-6 dark:border-brand-800 dark:bg-white/3">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                {t("seeker.resumes.formTitle")}
              </label>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400">
                {t("seeker.resumes.formSummary")}
              </label>
              <textarea
                rows={3}
                value={form.summary}
                onChange={(event) =>
                  setForm({ ...form, summary: event.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              />
            </div>

            <label className="flex items-center gap-3 text-theme-sm text-gray-700 dark:text-gray-400">
              <input
                type="checkbox"
                checked={form.isPrimary}
                onChange={(event) =>
                  setForm({ ...form, isPrimary: event.target.checked })
                }
                className="size-5 rounded-md border border-gray-300 accent-brand-500"
              />
              {t("seeker.resumes.formPrimary")}
            </label>

            {errorMessage ? (
              <p className="rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
                {errorMessage}
              </p>
            ) : null}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-3 text-theme-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
              >
                {t("common.save")}
              </button>
              <button
                type="button"
                onClick={() => setForm(null)}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {resumesQuery.isPending ? (
        <div className="h-40 animate-pulse rounded-2xl bg-gray-50 dark:bg-white/3" />
      ) : resumes.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-white/3">
          <p className="text-theme-sm text-gray-500 dark:text-gray-400">
            {t("seeker.resumes.empty")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-gray-800 dark:text-white/90">
                    {resume.title}
                  </h3>
                  {resume.summary ? (
                    <p className="mt-1 line-clamp-2 text-theme-sm text-gray-500 dark:text-gray-400">
                      {resume.summary}
                    </p>
                  ) : null}
                </div>
                {resume.isPrimary ? (
                  <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-theme-xs font-medium text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
                    {t("seeker.resumes.primary")}
                  </span>
                ) : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {!resume.isPrimary ? (
                  <button
                    type="button"
                    onClick={() =>
                      void primaryMutation
                        .mutateAsync(resume.id)
                        .catch(() => undefined)
                    }
                    className="rounded-lg border border-gray-300 px-3 py-2 text-theme-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                  >
                    {t("seeker.resumes.setPrimary")}
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => openEdit(resume)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-theme-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/3"
                >
                  {t("common.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => void handleDelete(resume)}
                  className="rounded-lg border border-error-300 px-3 py-2 text-theme-xs font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/40 dark:text-error-400"
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
