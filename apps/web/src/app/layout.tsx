import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Poneglyph — Smart Resource Allocation",
  description:
    "Poneglyph connects NGOs with volunteers through AI-powered resource allocation. Real-time data, intelligent matching, and actionable insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${onest.variable} font-onest antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
