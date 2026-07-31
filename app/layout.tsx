import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CYBER DEFENCE UGANDA | Fortifying The Digital Frontier",
  description: "Uganda's premier cybersecurity collective. Recruiting innovative minds, protecting digital infrastructure, and building cyber resilience across the nation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}