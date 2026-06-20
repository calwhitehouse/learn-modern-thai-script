import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  openGraphDefaults,
  twitterDefaults,
} from "@/lib/seo";
import { getSessionUser } from "@/lib/supabase/get-user";

export const metadata: Metadata = {
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: openGraphDefaults({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
  }),
  twitter: twitterDefaults({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
  }),
};

export default async function HomePage() {
  const user = await getSessionUser();

  return <LandingPage isAuthenticated={!!user} />;
}
