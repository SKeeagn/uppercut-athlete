import type { Metadata } from "next";
import { Oswald } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Game Readiness State Checklist | Uppercut",
  description:
    "Pre-competition mental readiness checklist for rugby players, by Uppercut.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Ready",
  },
  icons: {
    apple: "/icon-180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${oswald.variable} h-full`}>
      <body className="min-h-full bg-navy text-white antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
