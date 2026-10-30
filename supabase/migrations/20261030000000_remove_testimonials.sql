-- Avaliações passam a ser exibidas apenas pelo perfil da loja no Google.
-- Remove depoimentos cadastráveis e a mensagem pré-definida do WhatsApp nas categorias.
drop table if exists public.testimonials;
alter table public.battery_categories drop column if exists whatsapp_message;

-- SEO: palavra-chave principal no título da página, no H1 e na descrição (somente se ainda estiverem no texto original).
update public.site_settings set hero_title = 'Loja de baterias em Uberlândia com atendimento rápido' where id = 1 and hero_title = 'Baterias de qualidade para seguir em frente';
update public.site_settings set seo_title = 'Loja de baterias em Uberlândia - MG | Baterminas' where id = 1 and seo_title = 'Baterminas | Loja de baterias em Uberlândia - MG';
update public.site_settings set seo_description = 'Loja de baterias em Uberlândia: baterias para carros, motos, caminhões, estacionárias e nobreaks. Atendimento rápido e entrega em toda a cidade.' where id = 1 and seo_description = 'Encontre baterias para carros, motos, caminhões e aplicações estacionárias na Baterminas. Atendimento rápido e entrega em toda Uberlândia.';
