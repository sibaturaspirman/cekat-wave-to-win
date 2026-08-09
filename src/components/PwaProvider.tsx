"use client";

import { SerwistProvider } from "@serwist/turbopack/react";
import type { ReactNode } from "react";

type PwaProviderProps = {
  children: ReactNode;
};

export function PwaProvider({ children }: PwaProviderProps) {
  return (
    <SerwistProvider
      swUrl="/serwist/sw.js"
      reloadOnOnline={false}
      cacheOnNavigation
      // SW/precache is production-only; use `npm start` to verify offline.
      disable={process.env.NODE_ENV === "development"}
      options={{
        scope: "/",
        // Bundled SW is ESM (esbuild format: "esm").
        type: "module",
      }}
    >
      {children}
    </SerwistProvider>
  );
}
