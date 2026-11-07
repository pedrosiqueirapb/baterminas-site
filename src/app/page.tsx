import type { Metadata } from "next";
import { Footer, FloatingWhatsapp } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { About, Brands, Categories, Cta, Features, Hero, Location } from "@/components/public/sections";
import { jsonLd, websiteJsonLd } from "@/lib/seo";
import { getContentSafe } from "@/services/content";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { settings: s } = await getContentSafe();
  return {
    title: { absolute: s.seo_title },
    description: s.seo_description,
    alternates: { canonical: "/" },
    openGraph: { title: s.seo_title, description: s.seo_description, url: "/", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Logo da Baterminas" }] },
    twitter: { title: s.seo_title, description: s.seo_description, images: ["/og-image.png"] },
  };
}

export default async function HomePage() {
  const { settings, brands, categories } = await getContentSafe();
  return (
    <>
      <Header settings={settings} />
      <main id="conteudo">
        <Hero s={settings} />
        <Features />
        <Categories items={categories} s={settings} />
        <Brands items={brands} s={settings} />
        <About s={settings} />
        <Cta s={settings} />
        <Location s={settings} />
      </main>
      <Footer s={settings} />
      <FloatingWhatsapp s={settings} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(settings, brands, categories) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd(settings) }} />
    </>
  );
}
