"use client";

import HCaptcha from "@hcaptcha/react-hcaptcha";
import { useRef } from "react";
import { getHCaptchaSiteKey } from "@/lib/hcaptcha";

type AuthCaptchaProps = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
};

export function AuthCaptcha({ onVerify, onExpire }: AuthCaptchaProps) {
  const siteKey = getHCaptchaSiteKey();
  const captchaRef = useRef<HCaptcha>(null);

  if (!siteKey) {
    return (
      <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
        CAPTCHA is not configured. Add <code className="text-xs">NEXT_PUBLIC_HCAPTCHA_SITE_KEY</code>{" "}
        to your environment.
      </p>
    );
  }

  return (
    <HCaptcha
      ref={captchaRef}
      sitekey={siteKey}
      onVerify={onVerify}
      onExpire={() => {
        onExpire?.();
        captchaRef.current?.resetCaptcha();
      }}
    />
  );
}
