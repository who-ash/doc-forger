import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appName = "Doc Forger";
const appDescription = "DocForge is an AI-powered documentation engine that transforms your codebase into living, searchable documentation.";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  applicationName: appName,
  authors: [{ name: appName }],
  creator: appName,
  keywords: ["documents", "editor", "productivity", "doc-forger"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: appName,
    description: appDescription,
    siteName: appName,
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: appName,
    description: appDescription,
  },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    shortcut: "/icons/icon.svg",
    apple: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#111827",
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
