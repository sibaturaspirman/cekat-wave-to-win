import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createSerwistRoute } from "@serwist/turbopack";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout.trim() ||
  randomUUID();

/**
 * Only precache App Router documents here.
 * Everything under /public (assets, icons, mediapipe) is already
 * auto-globbed by Serwist — re-adding them with a different revision
 * throws conflicting-entries and breaks SW install (offline reopen fails).
 */
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "src/app/sw.ts",
    useNativeEsbuild: true,
    maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
    additionalPrecacheEntries: [
      { url: "/", revision },
      { url: "/~offline", revision },
      { url: "/manifest.webmanifest", revision },
    ],
  });
