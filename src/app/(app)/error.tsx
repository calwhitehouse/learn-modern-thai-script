"use client";

import { RouteError } from "@/components/RouteError";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return <RouteError error={error} reset={reset} />;
}
