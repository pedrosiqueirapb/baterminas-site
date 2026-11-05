"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { GOOGLE_TAG_ID } from "@/lib/constants";

/**
 * Google tag global (Google Ads). Carregada uma única vez, depois que a página fica interativa,
 * apenas em produção e fora da área administrativa. O ID é público por natureza.
 */
export function GoogleTag() {
  const pathname = usePathname();
  if (process.env.NODE_ENV !== "production" || pathname.startsWith("/admin")) return null;
  return (
    <>
      <Script id="google-tag-loader" src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`} strategy="afterInteractive" />
      <Script id="google-tag-config" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GOOGLE_TAG_ID}');`}
      </Script>
    </>
  );
}
