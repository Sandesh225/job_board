import React from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeModeScript } from "flowbite-react";
import { Toaster } from "sonner";

import "./globals.css";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "JobBoard - Find Your Dream Career",
  description:
    "Professional job board platform with AI-powered cover letter generation and advanced job tracking",
  generator: "v0.app",
  keywords: ["jobs", "careers", "job board", "ai", "cover letter"],
  authors: [{ name: "JobBoard Team" }],
  // REMOVED "viewport" from here to fix the console warning
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jobboard.app",
    siteName: "JobBoard",
    title: "JobBoard - Find Your Dream Career",
    description:
      "Professional job board platform with AI-powered cover letter generation",
  },
};

// Keep viewport settings in this separate export
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#101828" }, // Matches slate-950/dark bg
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeModeScript />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        {/* CUSTOMIZED TOASTER */}
        <Toaster
          position="top-right"
          richColors={true} // Enables colorful icons for success/error
          closeButton
          theme="system" // Syncs with Flowbite/Next-theme
          toastOptions={{
            // This forces the toast to use your Theme Variables
            style: {
              background: "hsl(var(--card))",
              color: "hsl(var(--foreground))",
              border: "1px solid hsl(var(--border))",
            },
            classNames: {
              toast: "shadow-lg rounded-lg",
              description: "text-muted-foreground",
              actionButton: "bg-primary text-primary-foreground",
              cancelButton: "bg-muted text-muted-foreground",
            },
          }}
        />

        <div className="flex flex-col min-h-screen">
          <Header />
          {/* Constrained width container to "zoom out" the content feel */}
          <main className="flex-grow pt-16 max-w-[1440px] mx-auto w-full px-4 sm:px-6">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}