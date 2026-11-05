import type { Metadata } from "next";
import { LegalPage } from "@/components/public/legal-page";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Saiba como o site da Baterminas trata informações e quais serviços externos ele utiliza.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Política de privacidade" updated="30 de outubro de 2026">
      <p>Esta política explica como o site da Baterminas trata informações. O site é institucional e não possui formulários públicos, cadastro de clientes nem comércio eletrônico.</p>
      <h2>Informações que coletamos</h2>
      <ul>
        <li>A loja não solicita nem armazena dados pessoais dos visitantes. A medição de anúncios é feita pela Google tag, descrita na seção de cookies.</li>
        <li>Ao clicar nos botões de contato, você é levado ao WhatsApp, ao Google Maps ou ao Instagram. Nesses serviços, vale a política de privacidade de cada um.</li>
        <li>O servidor de hospedagem pode registrar dados técnicos de acesso, como endereço IP e navegador, para segurança e funcionamento.</li>
      </ul>
      <h2>Cookies</h2>
      <p>O site público utiliza a Google tag (Google Ads), que pode gravar cookies para medir o desempenho de anúncios e contabilizar visitas e contatos vindos deles. Cookies de sessão são usados apenas na área administrativa, restrita à equipe autorizada. Você pode bloquear ou apagar cookies nas configurações do seu navegador.</p>
      <h2>Serviços de terceiros</h2>
      <ul>
        <li>Supabase, para armazenar o conteúdo do site e autenticar a equipe.</li>
        <li>Google, quando você abre o mapa ou o perfil de avaliações da loja.</li>
        <li>Google Ads (Google tag), para medir o desempenho de anúncios da loja.</li>
      </ul>
      <h2>Seus direitos</h2>
      <p>Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), você pode solicitar informações sobre seus dados pelos canais de contato da loja, indicados no rodapé.</p>
    </LegalPage>
  );
}
