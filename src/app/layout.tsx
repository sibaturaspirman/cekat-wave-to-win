import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { PwaProvider } from "@/components/PwaProvider";
import "./globals.css";

const whatsappSans = localFont({
  src: [
    {
      path: "../fonts/WhatsAppSans/WhatsAppSans-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/WhatsAppSans/WhatsAppSans-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/WhatsAppSans/WhatsAppSans-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-whatsapp-sans",
  display: "swap",
});

const APP_NAME = "Wave to Win";
const APP_DEFAULT_TITLE = "Wave to Win | Cekat.AI";
const APP_DESCRIPTION =
  "WhatsApp Business Summit 2026 — Wave to Win gamification kiosk";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: "%s | Wave to Win",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={whatsappSans.variable}>
      <body className={whatsappSans.className}>
        <PwaProvider>{children}</PwaProvider>
      </body>
    </html>
  );
}
