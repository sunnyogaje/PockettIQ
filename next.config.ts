import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
};

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    skipWaiting: true,
    // Never cache API/server-action responses — financial data must always
    // come from the network when online. Offline transaction creation is
    // intentionally not supported (see QuickAddSheet's online check).
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.destination === "document",
        handler: "NetworkFirst",
        options: { cacheName: "pages", networkTimeoutSeconds: 5 },
      },
      {
        urlPattern: ({ request }) =>
          ["style", "script", "worker", "font"].includes(request.destination),
        handler: "StaleWhileRevalidate",
        options: { cacheName: "static-assets" },
      },
      {
        urlPattern: ({ request }) => request.destination === "image",
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "images",
          expiration: { maxEntries: 64, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
    ],
  },
});

export default withPWA(nextConfig);
