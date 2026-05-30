import { MainWithNavigationLoading } from "@/components/NavigationLoading";
import { SiteNav } from "@/components/SiteNav";
import { AUTH_NAV_ITEMS, PUBLIC_NAV_ITEMS } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const items = user ? AUTH_NAV_ITEMS : PUBLIC_NAV_ITEMS;

  return (
    <div className="flex min-h-full flex-col">
      <SiteNav items={items} showSignOut={!!user} />
      <main className="app-container flex flex-1 flex-col py-6">
        <MainWithNavigationLoading>{children}</MainWithNavigationLoading>
      </main>
    </div>
  );
}
