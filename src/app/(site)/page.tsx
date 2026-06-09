import type { Metadata } from "next";
import { LandingPage } from "@/components/LandingPage";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  openGraphDefaults,
  twitterDefaults,
} from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <LandingPage isAuthenticated={!!user} />;
}
