import type { Metadata } from "next";
import { Prompt, Sarabun } from "next/font/google";
import { AppFooter } from "@/components/AppFooter";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${prompt.variable} ${sarabun.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-stone-50 text-stone-900 antialiased">
        <div className="flex flex-1 flex-col">{children}</div>
        <AppFooter />
      </body>
    </html>
  );
}
