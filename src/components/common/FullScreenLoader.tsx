interface FullScreenLoaderProps {
  label?: string;
}

export default function FullScreenLoader({ label }: FullScreenLoaderProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white dark:bg-gray-900">
      <span className="size-8 animate-spin rounded-full border-3 border-brand-500 border-t-transparent" />
      {label && (
        <span className="text-theme-sm text-gray-500 dark:text-gray-400">
          {label}
        </span>
      )}
    </div>
  );
}
