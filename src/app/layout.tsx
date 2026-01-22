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
  title: "Lab Pulse | Real-time progress matrix for labs",
  description:
    "Mission control for lab sessions with live student-task matrix, Firebase realtime, and Next.js app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
      >
        <div className="relative min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),transparent_35%),radial-gradient(circle_at_25%_15%,_rgba(16,185,129,0.1),transparent_25%),radial-gradient(circle_at_75%_20%,_rgba(236,72,153,0.08),transparent_25%)]" />
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
