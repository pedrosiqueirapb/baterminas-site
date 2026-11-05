"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { GOOGLE_TAG_ID, GOOGLE_TAG_MANAGER_ID } from "@/lib/constants";

/**
 * Rastreamento global: Google tag (Google Ads) + Google Tag Manager. Cada script é carregado uma única vez,
 * depois que a página fica interativa, apenas em produção e fora da área administrativa.
 * Os IDs são públicos por natureza.
 */
export function GoogleTag() {
  const pathname = usePathname();
  if (process.env.NODE_ENV !== "production" || pathname.startsWith("/admin")) return null;
  return (
    <>
      {/* dataLayer e gtag compartilhados pela Google tag e pelo GTM (inicialização única). */}
      <Script id="google-datalayer" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());`}
      </Script>
      <Script id="google-tag-loader" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`} strategy="afterInteractive" />
      <Script id="google-tag-config" strategy="afterInteractive">{`gtag('config', '${GOOGLE_TAG_ID}');`}</Script>
      <Script id="google-tag-manager" src={`https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_MANAGER_ID}`} strategy="afterInteractive" />
    </>
  );
}
