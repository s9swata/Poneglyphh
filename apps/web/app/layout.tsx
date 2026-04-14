import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Poneglyph — Smart Resource Allocation",
  description:
    "Poneglyph connects NGOs with volunteers through AI-powered resource allocation. Real-time data, intelligent matching, and actionable insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-onest antialiased">{children}</body>
    </html>
  );
}
