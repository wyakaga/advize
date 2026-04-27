import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import { ReactQueryClientProvider } from "@/components/ReactQueryClientProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Advize - AI Ads Optimization Advisor",
  description:
    "Optimize your advertising campaigns with AI-powered insights and actionable recommendations.",
};

//TODO: add test

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <ReactQueryClientProvider>
          <Providers>{children}</Providers>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
