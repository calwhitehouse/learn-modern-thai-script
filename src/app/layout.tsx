import type { Metadata } from "next";
import localFont from "next/font/local";
import { Prompt, Sarabun } from "next/font/google";
import { AppFooter } from "@/components/AppFooter";
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
  title: "Learn Modern Thai Script",
  description: "Practice reading modern Thai script from looped letterforms.",
  icons: {
    icon: "/favicon.png",
  },
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
