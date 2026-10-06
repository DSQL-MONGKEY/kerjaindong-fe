import Select from "@/components/form/Select";
import { useProvinces, useRegencies } from "@/hooks/useRegions";
import { useTranslation } from "react-i18next";

interface RegionCascadeProps {
  provinceId: string;
  cityId: string;
  onChange: (next: { provinceId: string; cityId: string }) => void;
}

export default function RegionCascade({
  provinceId,
  cityId,
  onChange,
}: RegionCascadeProps) {
  const { t } = useTranslation();
  const provincesQuery = useProvinces();
  const selectedProvince = provincesQuery.data?.find(
    (province) => province.id === provinceId,
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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="provinceId"
          className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
        >
          {t("seeker.profile.province")}
        </label>
        <Select
          id="provinceId"
          options={provinceOptions}
          placeholder={t("seeker.profile.provincePlaceholder")}
          defaultValue={provinceId}
          onChange={(nextProvinceId) =>
            onChange({ provinceId: nextProvinceId, cityId: "" })
          }
        />
      </div>

      <div>
        <label
          htmlFor="cityId"
          className="mb-1.5 block text-theme-xs font-medium text-gray-500 dark:text-gray-400"
        >
          {t("seeker.profile.city")}
        </label>
        <Select
          id="cityId"
          key={provinceId}
          options={cityOptions}
          placeholder={t("seeker.profile.cityPlaceholder")}
          defaultValue={cityId}
          onChange={(nextCityId) => onChange({ provinceId, cityId: nextCityId })}
        />
      </div>
    </div>
  );
}
