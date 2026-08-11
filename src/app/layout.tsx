import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { ObraProvider } from "@/components/providers/obra-store";
import { Toaster } from "@/components/shared/toaster";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ObraReal",
    template: "%s · ObraReal",
  },
  description:
    "Controle financeiro de obra: recursos, despesas e relatórios em um só lugar.",
};

export const viewport: Viewport = {
  themeColor: "#0f1117",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased">
        <ObraProvider>
          {children}
          <Toaster />
        </ObraProvider>
      </body>
    </html>
  );
}
