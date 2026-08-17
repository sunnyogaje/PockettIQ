import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "PockettIQ — Your Money. Smarter.",
    template: "%s — PockettIQ",
  },
  description:
    "PockettIQ helps you track your spending, manage your budget, and make your money last longer. Built for everyday Nigerians.",
  applicationName: "PockettIQ",
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    siteName: "PockettIQ",
    title: "PockettIQ — Your Money. Smarter.",
    description: "Know where your money goes.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PockettIQ — Your Money. Smarter.",
    description: "Know where your money goes.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PockettIQ",
  },
};

export const viewport: Viewport = {
  themeColor: "#1c4b3f",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
