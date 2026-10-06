import Select from "@/components/form/Select";
import { useProvinces, useRegencies } from "@/hooks/useRegions";
import type { EmploymentType, WorkMode } from "@/lib/job-types";
import { useTranslation } from "react-i18next";

export interface JobFilterState {
  q: string;
  provinceId: string;
  cityId: string;
  employmentType: string;
  workMode: string;
  salaryMin: string;
}

export const EMPTY_JOB_FILTERS: JobFilterState = {
  q: "",
  provinceId: "",
  cityId: "",
  employmentType: "",
  workMode: "",
  salaryMin: "",
};

const employmentTypes: EmploymentType[] = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "INTERNSHIP",
  "FREELANCE",
];

const workModes: WorkMode[] = ["ONSITE", "REMOTE", "HYBRID"];

interface JobFiltersProps {
  value: JobFilterState;
  onChange: (patch: Partial<JobFilterState>) => void;
  onReset: () => void;
}

export default function JobFilters({
  value,
  onChange,
  onReset,
}: JobFiltersProps) {
  const { t } = useTranslation();
  const provincesQuery = useProvinces();

  const selectedProvince = provincesQuery.data?.find(
    (province) => province.id === value.provinceId,
  );
  const regenciesQuery = useRegencies(selectedProvince?.code);

  const provinceOptions = (provincesQuery.data ?? []).map((province) => ({
    value: province.id,
    label: province.name,
  }));

  const cityOptions = (regenciesQuery.data ?? []).map((regency) => ({
    value: regency.id,
    label: regency.name,
  }));

  const employmentTypeOptions = employmentTypes.map((type) => ({
    value: type,
    label: t(`jobs.employmentType.${type}`),
  }));

  const workModeOptions = workModes.map((mode) => ({
    value: mode,
    label: t(`jobs.workMode.${mode}`),
  }));

  return (
    <form
      key={`${value.q}|${value.salaryMin}`}
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onChange({
          q: String(formData.get("q") ?? "").trim(),
          salaryMin: String(formData.get("salaryMin") ?? "").trim(),
        });
      }}
      className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="md:col-span-2 xl:col-span-1">
          <label
            htmlFor="q"
            className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {t("jobs.filters.keyword")}
          </label>
          <input
            id="q"
            name="q"
            defaultValue={value.q}
            placeholder={t("jobs.searchPlaceholder")}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div>
          <label
            htmlFor="filter-province"
            className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {t("jobs.filters.province")}
          </label>
          <Select
            id="filter-province"
            options={provinceOptions}
            placeholder={t("jobs.filters.allProvinces")}
            defaultValue={value.provinceId}
            onChange={(provinceId) =>
              onChange({ provinceId, cityId: "" })
            }
          />
        </div>

        <div>
          <label
            htmlFor="filter-city"
            className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {t("jobs.filters.city")}
          </label>
          <Select
            id="filter-city"
            key={value.provinceId}
            options={cityOptions}
            placeholder={t("jobs.filters.allCities")}
            defaultValue={value.cityId}
            onChange={(cityId) => onChange({ cityId })}
          />
        </div>

        <div>
          <label
            htmlFor="filter-employment-type"
            className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {t("jobs.filters.employmentType")}
          </label>
          <Select
            id="filter-employment-type"
            options={employmentTypeOptions}
            placeholder={t("jobs.filters.allEmploymentTypes")}
            defaultValue={value.employmentType}
            onChange={(employmentType) => onChange({ employmentType })}
          />
        </div>

        <div>
          <label
            htmlFor="filter-work-mode"
            className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {t("jobs.filters.workMode")}
          </label>
          <Select
            id="filter-work-mode"
            options={workModeOptions}
            placeholder={t("jobs.filters.allWorkModes")}
            defaultValue={value.workMode}
            onChange={(workMode) => onChange({ workMode })}
          />
        </div>

        <div>
          <label
            htmlFor="salaryMin"
            className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
          >
            {t("jobs.filters.salaryMin")}
          </label>
          <input
            id="salaryMin"
            name="salaryMin"
            type="number"
            min={0}
            step={500000}
            defaultValue={value.salaryMin}
            placeholder={t("jobs.filters.salaryMinPlaceholder")}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/10 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-5 py-2.5 text-theme-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
        >
          {t("jobs.filters.apply")}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/3"
        >
          {t("jobs.filters.reset")}
        </button>
      </div>
    </form>
  );
}
