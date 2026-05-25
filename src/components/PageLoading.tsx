import { LoadingSpinner } from "@/components/LoadingSpinner";

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-stone-500">Loading…</p>
    </div>
  );
}
