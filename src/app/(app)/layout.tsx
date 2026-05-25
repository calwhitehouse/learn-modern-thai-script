import { AppNav } from "@/components/AppNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <AppNav />
      <main className="mx-auto w-full max-w-lg flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
