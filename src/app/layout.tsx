import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "WhoCrawledMe - AI Platform Intelligence",
  description: "Comprehensive AI platform intelligence system for monitoring brand visibility, competitive analysis, and content optimization across 25+ AI platforms including ChatGPT, Claude, Gemini, and Perplexity.",
  keywords: "AI platform monitoring, brand intelligence, competitive analysis, content optimization, ChatGPT, Claude, Gemini, Perplexity",
  authors: [{ name: "WhoCrawledMe Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50`}
      >
        <div className="min-h-screen bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 backdrop-blur-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
