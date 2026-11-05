type Gtag = (command: "event", eventName: string, params?: Record<string, unknown>) => void;

/**
 * Envia um evento para a Google tag, se ela estiver carregada (produção). Sem efeito caso contrário.
 * Para conversões do Google Ads, `sendTo` deve ser "AW-ID/RÓTULO" com o rótulo REAL da ação de conversão.
 * Esta função ainda NÃO é usada em nenhum botão: o rótulo da conversão "Contato WhatsApp" será conectado depois.
 */
export function trackEvent(eventName: string, params?: Record<string, unknown>): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  gtag?.("event", eventName, params);
}
