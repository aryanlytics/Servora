import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Servora — Local Service Marketplace",
  description:
    "Find and book trusted local service professionals. Plumbers, electricians, cleaners and more — available near you with real-time booking.",
  keywords: ["service marketplace", "local services", "plumber", "electrician", "booking"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-bg-dark text-white/95 font-sans min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
