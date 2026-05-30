"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { PageLoading } from "@/components/PageLoading";

const NavigationLoadingContext = createContext<(() => void) | null>(null);

export function useNavigationLoading() {
  return useContext(NavigationLoadingContext);
}

export function MainWithNavigationLoading({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, [pathname]);

  const startNavigation = useCallback(() => {
    setIsLoading(true);
  }, []);

  return (
    <NavigationLoadingContext.Provider value={startNavigation}>
      <div className="relative flex min-h-[12rem] flex-1 flex-col">
        {isLoading ? (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center bg-stone-50/90"
            aria-busy="true"
            aria-live="polite"
          >
            <PageLoading />
          </div>
        ) : null}
        {children}
      </div>
    </NavigationLoadingContext.Provider>
  );
}
