-- Baterminas: esquema inicial, RLS e storage

create extension if not exists pgcrypto;

-- Allowlist de administradores (preenchida apenas por procedimento do implantador)
create table public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

-- Admin = está na allowlist E concluiu o segundo fator (aal2)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid())
     and coalesce(auth.jwt() ->> 'aal', '') = 'aal2';
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Allowlist sem aal2 (usada só para decidir o fluxo de MFA no servidor)
create or replace function public.is_allowlisted()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users a where a.user_id = auth.uid());
$$;
revoke all on function public.is_allowlisted() from public;
grant execute on function public.is_allowlisted() to authenticated;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- site_settings (linha única)
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  business_name text not null default 'Baterminas' check (char_length(business_name) between 1 and 80),
  phone text not null default '(34) 3229-5639' check (char_length(phone) <= 30),
  whatsapp text not null default '5534999954450' check (whatsapp ~ '^[0-9]{12,13}$'),
  instagram_url text not null default 'https://www.instagram.com/baterminas_udia/' check (instagram_url ~ '^https://'),
  google_profile_url text not null default '' check (google_profile_url = '' or google_profile_url ~ '^https://'),
  address_line text not null default 'Av. Comendador Alexandrino Garcia, 1270' check (char_length(address_line) <= 160),
  address_complement text not null default '' check (char_length(address_complement) <= 120),
  neighborhood text not null default 'Marta Helena' check (char_length(neighborhood) <= 80),
  city text not null default 'Uberlândia' check (char_length(city) <= 80),
  state text not null default 'MG' check (char_length(state) = 2),
  postal_code text not null default '' check (postal_code = '' or postal_code ~ '^[0-9]{5}-?[0-9]{3}$'),
  opening_hours jsonb not null default '[]'::jsonb check (jsonb_typeof(opening_hours) = 'array' and jsonb_array_length(opening_hours) <= 10),
  hours_note text not null default '' check (char_length(hours_note) <= 200),
  hero_title text not null default 'Baterias de qualidade para seguir em frente' check (char_length(hero_title) <= 120),
  hero_description text not null default 'Encontre a bateria ideal para o seu veículo com atendimento rápido, marcas de qualidade e entrega em toda Uberlândia.' check (char_length(hero_description) <= 300),
  hero_image_path text not null default '' check (char_length(hero_image_path) <= 300),
  hero_image_alt text not null default 'Veículo moderno em uma estrada ao entardecer' check (char_length(hero_image_alt) <= 200),
  about_title text not null default 'Sua parceira em baterias em Uberlândia' check (char_length(about_title) <= 120),
  about_text text not null default 'A Baterminas oferece soluções em baterias para diferentes veículos e aplicações, com atendimento próximo, marcas de qualidade e praticidade para você continuar sua jornada.' check (char_length(about_text) <= 600),
  about_image_path text not null default '' check (char_length(about_image_path) <= 300),
  about_image_alt text not null default 'Ambiente automotivo profissional' check (char_length(about_image_alt) <= 200),
  cta_title text not null default 'Precisa de uma bateria?' check (char_length(cta_title) <= 120),
  cta_description text not null default 'Entre em contato com a Baterminas e consulte as opções disponíveis para o seu veículo.' check (char_length(cta_description) <= 300),
  footer_copyright text not null default '© 2026 Baterminas. Todos os direitos reservados.' check (char_length(footer_copyright) <= 160),
  logo_path text not null default '' check (char_length(logo_path) <= 300),
  seo_title text not null default 'Baterminas | Loja de baterias em Uberlândia - MG' check (char_length(seo_title) <= 70),
  seo_description text not null default 'Encontre baterias para carros, motos, caminhões e aplicações estacionárias na Baterminas. Atendimento rápido e entrega em toda Uberlândia.' check (char_length(seo_description) <= 170),
  show_reviews boolean not null default true,
  show_about boolean not null default true,
  updated_at timestamptz not null default now()
);
insert into public.site_settings (id) values (1);
create trigger site_settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

-- battery_brands
create table public.battery_brands (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  description text not null default '' check (char_length(description) <= 300),
  image_path text not null default '' check (char_length(image_path) <= 300),
  image_alt text not null default '' check (char_length(image_alt) <= 200),
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index battery_brands_order_idx on public.battery_brands (active, sort_order);
create trigger battery_brands_touch before update on public.battery_brands for each row execute function public.touch_updated_at();

-- battery_categories
create table public.battery_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9-]{2,40}$'),
  title text not null check (char_length(title) between 1 and 80),
  description text not null default '' check (char_length(description) <= 300),
  image_path text not null default '' check (char_length(image_path) <= 300),
  image_alt text not null default '' check (char_length(image_alt) <= 200),
  whatsapp_message text not null default '' check (char_length(whatsapp_message) <= 200),
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index battery_categories_order_idx on public.battery_categories (published, sort_order);
create trigger battery_categories_touch before update on public.battery_categories for each row execute function public.touch_updated_at();

-- testimonials: origem nunca "google"
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 1 and 60),
  body text not null check (char_length(body) between 5 and 500),
  testimonial_date date,
  source text not null default 'cliente_loja' check (source in ('cliente_loja', 'site')),
  authorized boolean not null default false,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  check (not published or authorized)
);
create index testimonials_pub_idx on public.testimonials (published, created_at desc);

-- audit_log
create table public.audit_log (
  id bigserial primary key,
  user_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;

-- RLS
alter table public.site_settings enable row level security;
alter table public.battery_brands enable row level security;
alter table public.battery_categories enable row level security;
alter table public.testimonials enable row level security;

create policy settings_read on public.site_settings for select using (true);
create policy settings_update on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy brands_read_public on public.battery_brands for select using (active or public.is_admin());
create policy brands_insert on public.battery_brands for insert to authenticated with check (public.is_admin());
create policy brands_update on public.battery_brands for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy brands_delete on public.battery_brands for delete to authenticated using (public.is_admin());

create policy categories_read_public on public.battery_categories for select using (published or public.is_admin());
create policy categories_insert on public.battery_categories for insert to authenticated with check (public.is_admin());
create policy categories_update on public.battery_categories for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy categories_delete on public.battery_categories for delete to authenticated using (public.is_admin());

create policy testimonials_read_public on public.testimonials for select using ((published and authorized) or public.is_admin());
create policy testimonials_insert on public.testimonials for insert to authenticated with check (public.is_admin());
create policy testimonials_update on public.testimonials for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy testimonials_delete on public.testimonials for delete to authenticated using (public.is_admin());

create policy audit_read on public.audit_log for select to authenticated using (public.is_admin());
create policy audit_insert on public.audit_log for insert to authenticated with check (public.is_admin() and user_id = auth.uid());

-- Dados iniciais
insert into public.battery_brands (name, description, image_alt, sort_order) values
  ('Moura', 'Baterias Moura disponíveis na loja. Consulte as opções pelo WhatsApp.', 'Bateria conceitual representando a marca Moura', 0),
  ('Zetta', 'Baterias Zetta disponíveis na loja. Consulte as opções pelo WhatsApp.', 'Bateria conceitual representando a marca Zetta', 1),
  ('Varta', 'Baterias Varta disponíveis na loja. Consulte as opções pelo WhatsApp.', 'Bateria conceitual representando a marca Varta', 2),
  ('Formax', 'Baterias Formax disponíveis na loja. Consulte as opções pelo WhatsApp.', 'Bateria conceitual representando a marca Formax', 3);

insert into public.battery_categories (slug, title, description, image_alt, whatsapp_message, sort_order) values
  ('carros', 'Baterias para carros', 'Consulte as opções para o seu carro.', 'Carro estacionado em ambiente urbano', 'Olá! Gostaria de consultar uma bateria para meu carro.', 0),
  ('motos', 'Baterias para motos', 'Consulte as opções para a sua moto.', 'Motocicleta em ambiente urbano', 'Olá! Gostaria de consultar uma bateria para minha moto.', 1),
  ('caminhoes', 'Baterias para caminhões', 'Consulte as opções para veículos pesados.', 'Caminhão em uma rodovia', 'Olá! Gostaria de consultar uma bateria para caminhão.', 2),
  ('estacionarias', 'Baterias estacionárias', 'Consulte as opções para sistemas estacionários.', 'Banco de baterias estacionárias em ambiente técnico', 'Olá! Gostaria de consultar baterias estacionárias.', 3),
  ('nobreaks', 'Baterias para nobreaks', 'Consulte as opções para o seu nobreak.', 'Nobreak em ambiente de escritório', 'Olá! Gostaria de consultar baterias para nobreak.', 4);

-- Storage: bucket público para imagens do site, escrita só por admin
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-images', 'site-images', true, 3145728, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy site_images_admin_insert on storage.objects for insert to authenticated with check (bucket_id = 'site-images' and public.is_admin());
create policy site_images_admin_update on storage.objects for update to authenticated using (bucket_id = 'site-images' and public.is_admin()) with check (bucket_id = 'site-images' and public.is_admin());
create policy site_images_admin_delete on storage.objects for delete to authenticated using (bucket_id = 'site-images' and public.is_admin());
