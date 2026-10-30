import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Baterminas | Loja de baterias em Uberlândia - MG", template: "%s | Baterminas" },
  description:
    "Encontre baterias para carros, motos, caminhões e aplicações estacionárias na Baterminas. Atendimento rápido e entrega em toda Uberlândia.",
  applicationName: "Baterminas",
  openGraph: { type: "website", locale: "pt_BR", siteName: "Baterminas" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#171a21", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}
