export function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  periodLabel: string,
): string {
  if (min == null && max == null) return "";

  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  const range =
    min != null && max != null && min !== max
      ? `${formatter.format(min)} - ${formatter.format(max)}`
      : formatter.format((min ?? max)!);

  return `${range}${periodLabel}`;
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
