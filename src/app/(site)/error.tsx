"use client";

import { RouteError } from "@/components/RouteError";

type SiteErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function SiteError({ error, reset }: SiteErrorProps) {
  return <RouteError error={error} reset={reset} />;
}
