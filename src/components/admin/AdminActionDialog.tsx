import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface AdminActionOption {
  value: string;
  label: string;
}

interface AdminActionDialogProps {
  title: string;
  description?: string;
  options: AdminActionOption[];
  initialValue: string;
  noteLabel?: string;
  requireNote?: boolean;
  submitLabel?: string;
  errorMessage?: string | null;
  isPending?: boolean;
  onSubmit: (value: string, note: string) => void;
  onClose: () => void;
}

export default function AdminActionDialog({
  title,
  description,
  options,
  initialValue,
  noteLabel,
  requireNote = false,
  submitLabel,
  errorMessage,
  isPending = false,
  onSubmit,
  onClose,
}: AdminActionDialogProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);
  const [note, setNote] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleSubmit = () => {
    if (requireNote && !note.trim()) {
      setLocalError(t("admin.noteRequired"));
      return;
    }
    setLocalError(null);
    onSubmit(value, note.trim());
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-action-dialog-title"
      className="fixed inset-0 z-99999 flex items-center justify-center bg-gray-900/50 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xl dark:border-gray-800 dark:bg-gray-900">
        <h2
          id="admin-action-dialog-title"
          className="text-base font-semibold text-gray-900 dark:text-white"
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-theme-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        ) : null}

        <div className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="admin-action-value"
              className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
            >
              {t("admin.actionLabel")}
            </label>
            <select
              id="admin-action-value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {noteLabel ? (
            <div>
              <label
                htmlFor="admin-action-note"
                className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
              >
                {noteLabel}
              </label>
              <textarea
                id="admin-action-note"
                rows={3}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
              />
            </div>
          ) : null}

          {localError || errorMessage ? (
            <p className="rounded-lg bg-error-50 px-4 py-3 text-theme-sm text-error-600 dark:bg-error-500/10 dark:text-error-400">
              {localError ?? errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-lg bg-brand-500 px-4 py-2.5 text-theme-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-60"
            >
              {isPending ? t("common.loading") : (submitLabel ?? t("common.save"))}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
