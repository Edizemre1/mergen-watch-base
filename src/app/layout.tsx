import type { Metadata } from "next";
import { LanguageProvider } from "@/components/language";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mergen Watch Base",
  description:
    "A social squad and watchlist game prototype for Base token characters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
