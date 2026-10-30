import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal-page";

export const metadata: Metadata = {
  title: "Termos de uso",
  description: "Condições gerais de uso do site institucional da Baterminas.",
  alternates: { canonical: "/termos" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Termos de uso" updated="29 de outubro de 2026">
      <p>Ao acessar o site da Baterminas, você concorda com as condições abaixo.</p>
      <h2>Finalidade do site</h2>
      <p>O site apresenta a loja, suas marcas e formas de contato. Ele não realiza vendas nem reservas. Disponibilidade, preços e condições comerciais são informados diretamente pela loja.</p>
      <h2>Imagens</h2>
      <p>Imagens ilustrativas não representam produtos, embalagens ou o estabelecimento específicos.</p>
      <h2>Marcas</h2>
      <p>Moura, Zetta, Varta e Formax são marcas de seus respectivos titulares e são citadas apenas para indicar os produtos comercializados.</p>
      <h2>Links externos</h2>
      <p>O site contém links para serviços de terceiros. A Baterminas não controla o conteúdo desses serviços.</p>
      <h2>Alterações</h2>
      <p>Estes termos podem ser atualizados a qualquer momento. A versão vigente é a publicada nesta página.</p>
    </LegalPage>
  );
}
