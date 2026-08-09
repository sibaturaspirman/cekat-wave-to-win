import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { createSerwistRoute } from "@serwist/turbopack";
import { MEDIAPIPE_PRECACHE_URLS } from "@/lib/mediapipe";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout.trim() ||
  randomUUID();

const staticAssets = [
  "/",
  "/~offline",
  "/manifest.webmanifest",
  "/assets/start-blob.svg",
  "/assets/scanner-frame.svg",
  "/assets/logo-cekat.png",
  "/assets/logo-cekat-2.png",
  "/assets/bg-cream.png",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  ...MEDIAPIPE_PRECACHE_URLS,
] as const;

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    swSrc: "src/app/sw.ts",
    useNativeEsbuild: true,
    // MediaPipe WASM/model are ~8–12MB; default limit skips them.
    maximumFileSizeToCacheInBytes: 20 * 1024 * 1024,
    additionalPrecacheEntries: staticAssets.map((url) => ({ url, revision })),
  });
