import { cn } from "@/lib/cn";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-4 w-4 border",
  md: "h-8 w-8 border-2",
  lg: "h-10 w-10 border-2",
} as const;

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "inline-block animate-spin rounded-full border-stone-200 border-t-stone-800",
        sizeClass[size],
        className,
      )}
    />
  );
}
