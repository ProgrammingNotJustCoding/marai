import type { Metadata } from "next";
import "./globals.css";

import dynamic from "next/dynamic";
const ThemeProvider = dynamic(() =>
  import("next-themes").then((mod) => mod.ThemeProvider),
);

export const metadata: Metadata = {
  title: "Marai",
  description:
    "Marai is an application to streamline legal consultations and case file management for clients and law firms.",
  icons: {
    icon: "/images/logo-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" enableSystem defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
