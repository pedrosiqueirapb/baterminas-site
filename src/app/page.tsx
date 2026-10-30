import type { Metadata } from "next";
import { Footer, FloatingWhatsapp } from "@/components/public/footer";
import { Header } from "@/components/public/header";
import { About, Brands, Categories, Cta, Features, Hero, Location, Reviews } from "@/components/public/sections";
import { getGoogleReviews } from "@/lib/google-places";
import { jsonLd } from "@/lib/seo";
import { getContentSafe } from "@/services/content";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const { settings: s } = await getContentSafe();
  return {
    title: { absolute: s.seo_title },
    description: s.seo_description,
    alternates: { canonical: "/" },
    openGraph: { title: s.seo_title, description: s.seo_description, url: "/", images: [{ url: "/images/hero-carro-estrada.webp", width: 1600, height: 1600, alt: s.hero_image_alt }] },
    twitter: { title: s.seo_title, description: s.seo_description, images: ["/images/hero-carro-estrada.webp"] },
  };
}

export default async function HomePage() {
  const { settings, brands, categories, testimonials } = await getContentSafe();
  const google = settings.show_reviews ? await getGoogleReviews() : null;
  return (
    <>
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-ink">
        Ir para o conteúdo
      </a>
      <Header settings={settings} />
      <main id="conteudo">
        <Hero s={settings} />
        <Features />
        <Categories items={categories} s={settings} />
        <Brands items={brands} s={settings} />
        <About s={settings} />
        <Reviews s={settings} google={google} testimonials={testimonials} />
        <Cta s={settings} />
        <Location s={settings} />
      </main>
      <Footer s={settings} />
      <FloatingWhatsapp s={settings} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(settings) }} />
    </>
  );
}
