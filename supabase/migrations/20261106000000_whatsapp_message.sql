-- Mensagem personalizada do WhatsApp por marca e por categoria (vazia = mensagem automática).
alter table public.battery_brands
  add column if not exists whatsapp_message text not null default ''
  check (char_length(whatsapp_message) <= 200);

alter table public.battery_categories
  add column if not exists whatsapp_message text not null default ''
  check (char_length(whatsapp_message) <= 200);
