# Baterminas: site institucional e painel administrativo

Site público (Next.js + Supabase) para a Baterminas, loja de baterias em Uberlândia - MG, com painel administrativo protegido por senha e segundo fator (TOTP).

## Tecnologias

Next.js 15 (App Router), React 19, TypeScript estrito, Tailwind CSS 4, Supabase (Postgres, Auth, Storage), Zod, lucide-react, Vitest.

## Estrutura

```
src/app/                 rotas (/, /privacidade, /termos, /admin/*), sitemap, robots, 404/erro
src/app/admin/actions/   server actions (auth/MFA e CRUD), sempre com requireAdmin()
src/components/public    seções do site; components/admin: formulários do painel
src/lib/                 auth (guard aal2), validation (zod), text (capitalização), whatsapp, seo
src/services/content.ts  leitura pública agrupada, com cache por tag e contingência
src/tests/               testes unitários
supabase/migrations/     esquema, RLS, storage e dados iniciais
scripts/                 create-admin.mjs, prepare-logo.mjs
```

## Instalação local

Requer Node 20.9+ (recomendado 22 LTS).

```bash
npm install
cp .env.example .env.local   # preencha os valores
npm run dev
```

Sem variáveis do Supabase o site público abre com o conteúdo de contingência e o painel fica indisponível.

## Logo e favicon

1. Salve a logo oficial como `logo-original.png` na raiz.
2. Execute `npm run logo`. Isso gera `public/logo.png`, `src/app/icon.png`, `src/app/apple-icon.png` e `public/og-image.png`.

## Supabase

1. Crie um projeto em supabase.com.
2. Aplique, em ordem, as migrações de `supabase/migrations/` (`20261029000000_initial_schema.sql` e `20261030000000_remove_testimonials.sql`) no SQL Editor, ou com `supabase db push` após `supabase link`.
3. Em **Authentication > Providers**, mantenha E-mail ligado e **desative "Allow new users to sign up"**. Em **Authentication > Multi-Factor**, confirme que TOTP está habilitado.
4. Em **Authentication > Policies**, ative proteção de senha vazada e defina o mínimo de 12 caracteres.
5. O bucket `site-images` é criado pela migração (público, 3 MB, JPEG/PNG/WebP/AVIF; escrita só por administradores com aal2).
6. Copie URL e anon key para `.env.local`.

## Primeiro administrador

Executado só pelo responsável pela implantação, em máquina segura:

```bash
# coloque SUPABASE_SERVICE_ROLE_KEY apenas no seu .env.local
node --env-file=.env.local scripts/create-admin.mjs criar
```

A senha é digitada no terminal (mínimo 12 caracteres, com maiúscula, minúscula, número e símbolo). Depois, acesse `/admin/login`, entre e configure o aplicativo autenticador em `/admin/mfa`.

**Recuperação de acesso** (celular perdido): `node --env-file=.env.local scripts/create-admin.mjs resetar-mfa`. O usuário configurará um novo autenticador no próximo login.

Nunca publique a chave de serviço em hospedagem, repositório ou chat.

## Como a segurança funciona

- Administrador = usuário na tabela `admin_users` **e** sessão `aal2` (TOTP concluído). Verificado em `requireAdmin()` no servidor e novamente por RLS em `is_admin()`.
- Cadastro público desativado; não há senha padrão.
- Uploads: limite 3 MB, tipo real pelos bytes (não pela extensão), nome UUID, bucket sem execução de arquivos.
- Cabeçalhos: CSP sem `unsafe-eval` em produção, HSTS, nosniff, Referrer-Policy, frame-ancestors none. `/admin` com `noindex` e `no-store`.
- Limitação de tentativas de login e TOTP em memória, por instância. Em hospedagem serverless com várias instâncias, ela complementa (não substitui) os limites do Supabase Auth.

## Build e implantação

```bash
npm run lint && npm run typecheck && npm test && npm run build
npm start
```

Hospedagem sugerida: Vercel. Configure as variáveis de ambiente (exceto a chave de serviço) e `NEXT_PUBLIC_SITE_URL` com o domínio final. Aponte o domínio em DNS conforme o provedor e use sempre HTTPS.

## SEO

- Metadados, canônicas, Open Graph, JSON-LD `AutoPartsStore`, `sitemap.xml` e `robots.txt` são gerados automaticamente.
- Após publicar, cadastre o domínio no Google Search Console, envie o sitemap e vincule ao Google Business Profile.
- Coordenadas geográficas não foram incluídas por não terem sido verificadas.

## Manutenção

- Conteúdo: tudo em `/admin`. Cada salvamento invalida o cache e atualiza o site público.
- Textos devem seguir a regra: só a primeira letra da frase em maiúscula (exceto nomes próprios, marcas e siglas). O painel valida.
- Atualize dependências periodicamente (`npm outdated`) e rode os testes.
- Novas migrações vão em `supabase/migrations` com data no nome.

## Variáveis de ambiente em produção (Vercel)

| Variável | Onde | Observação |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | URL do projeto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Vercel | Chave pública; a proteção dos dados vem das políticas RLS. |
| `NEXT_PUBLIC_SITE_URL` | Vercel | Domínio final, sem barra no fim (canônicas, sitemap, Open Graph). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Somente `.env.local` do implantador** | Nunca na Vercel, no repositório ou no chat. |

## Checklist antes de publicar

1. Migrações aplicadas e `Allow new users to sign up` desativado no Supabase.
2. Em **Authentication > URL Configuration**, `Site URL` com o domínio final.
3. Primeiro administrador criado (`create-admin.mjs criar`) e 2FA configurado em `/admin/mfa`.
4. Variáveis da tabela acima definidas na Vercel; Framework Preset **Next.js**.
5. `npm run lint && npx tsc --noEmit && npm test && npm run build` sem erros e `npm audit --omit=dev` sem vulnerabilidades.
6. Domínio no Google Search Console e envio do `/sitemap.xml`.

**Rollback:** na Vercel, promova o deploy anterior (Deployments > Promote to Production). As migrações são aditivas; antes de alterar o banco, faça backup pelo painel do Supabase.
