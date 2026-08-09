/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  // Offline-first: avoid navigation preload racing the network and
  // returning a failed response instead of the precached app shell.
  navigationPreload: false,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        // Always serve the main app shell for document navigations.
        url: "/",
        matcher({ request }) {
          return request.mode === "navigate" || request.destination === "document";
        },
      },
      {
        url: "/~offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
