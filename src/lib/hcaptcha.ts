/** hCaptcha site key (public). Secret key belongs in Supabase Auth settings only. */
export function getHCaptchaSiteKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY?.trim();
  return key || undefined;
}

export function isHCaptchaConfigured(): boolean {
  return Boolean(getHCaptchaSiteKey());
}
