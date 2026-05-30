import { MainWithNavigationLoading } from "@/components/NavigationLoading";
import { SiteNav } from "@/components/SiteNav";
import { AUTH_NAV_ITEMS } from "@/lib/data";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteNav items={AUTH_NAV_ITEMS} showSignOut />
      <main className="app-container flex flex-1 flex-col py-6">
        <MainWithNavigationLoading>{children}</MainWithNavigationLoading>
      </main>
    </div>
  );
}
