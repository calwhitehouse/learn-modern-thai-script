import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/** hCaptcha domains — required when Auth CAPTCHA is enabled (see Supabase auth-captcha guide). */
const hcaptchaSources = "https://hcaptcha.com https://*.hcaptcha.com";

/** Basic CSP compatible with Next.js (inline scripts/styles), self-hosted fonts, and hCaptcha. */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${hcaptchaSources}${isDev ? " 'unsafe-eval'" : ""}`,
  `style-src 'self' 'unsafe-inline' ${hcaptchaSources}`,
  `img-src 'self' data: blob: ${hcaptchaSources}`,
  "font-src 'self'",
  `connect-src 'self' ${hcaptchaSources}${isDev ? " ws: wss:" : ""}`,
  `frame-src 'self' ${hcaptchaSources}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
