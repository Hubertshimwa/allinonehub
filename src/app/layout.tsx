import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://allinonehub.org"),
  title: { default: "Allinonehub — Your next step starts here", template: "%s | Allinonehub" },
  description: "A trusted digital home for opportunities, practical learning, and community.",
  keywords: ["scholarships", "jobs", "learning", "Africa", "community", "opportunities"],
  openGraph: { type: "website", siteName: "Allinonehub", title: "Allinonehub — Your next step starts here", description: "Discover opportunities, learn practical skills, and find your people." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}><body className="min-h-full bg-white font-sans text-slate-950">{children}</body></html>;
}
