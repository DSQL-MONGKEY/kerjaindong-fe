import { cn } from "@/utils";

interface BrandMarkProps {
  compact?: boolean;
  className?: string;
}

/**
 * Wordmark sementara "Kerjaindong". Ganti isi komponen ini saat aset logo
 * resmi tersedia (light/dark + ikon).
 */
export default function BrandMark({ compact = false, className }: BrandMarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-500 text-lg font-bold text-white shadow-theme-xs">
        K
      </span>
      {!compact && (
        <span className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
          Kerjaindong
        </span>
      )}
    </span>
  );
}
