"use client";

import dynamic from "next/dynamic";

const LoginForms = dynamic(
  () => import("@/components/LoginForms").then((m) => m.LoginForms),
  {
    ssr: false,
    loading: () => <p className="mt-6 text-sm text-stone-500">Loading sign-in form…</p>,
  },
);

type LoginFormsLoaderProps = {
  next: string;
  isSignup: boolean;
};

export function LoginFormsLoader({ next, isSignup }: LoginFormsLoaderProps) {
  return <LoginForms next={next} isSignup={isSignup} />;
}
