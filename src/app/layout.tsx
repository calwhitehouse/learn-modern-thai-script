import type { Metadata } from "next";
import localFont from "next/font/local";
import { Prompt, Sarabun } from "next/font/google";
import { AppFooter } from "@/components/AppFooter";
import {
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  openGraphDefaults,
  twitterDefaults,
} from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const finlandicaText = localFont({
  src: [
    {
      path: "../fonts/FinlandicaText-400.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/FinlandicaText-500.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/FinlandicaText-600.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const prompt = Prompt({
  variable: "--font-thai-modern",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

const sarabun = Sarabun({
  variable: "--font-thai-looped",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: openGraphDefaults(),
  twitter: twitterDefaults(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${finlandicaText.variable} ${prompt.variable} ${sarabun.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-stone-50 text-stone-900 antialiased">
        <div className="flex flex-1 flex-col">{children}</div>
        <AppFooter />
      </body>
    </html>
  );
}
