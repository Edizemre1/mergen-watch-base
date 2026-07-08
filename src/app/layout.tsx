import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mergen Watch Base",
  description:
    "A Base-native social watchlist and token performance demo powered by mock data.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
