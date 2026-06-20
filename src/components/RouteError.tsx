"use client";

type RouteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export function RouteError({ error, reset }: RouteErrorProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <h2 className="text-lg font-semibold text-stone-900">Something went wrong</h2>
      <p className="max-w-md text-sm text-stone-600">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded-xl bg-brand-teal px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-teal-hover"
      >
        Try again
      </button>
    </div>
  );
}
