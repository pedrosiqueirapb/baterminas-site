import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Loja de baterias em Uberlândia - MG | Baterminas", template: "%s | Baterminas" },
  description:
    "Loja de baterias em Uberlândia: baterias para carros, motos, caminhões, estacionárias e nobreaks. Atendimento rápido e entrega em toda a cidade.",
  applicationName: "Baterminas",
  // Metadados técnicos: não alteram nenhum texto visível.
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: false, address: false, email: false },
  category: "automotive",
  other: { "geo.region": "BR-MG", "geo.placename": "Uberlândia" },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } } : {}),
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
