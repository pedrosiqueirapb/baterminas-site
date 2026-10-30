// Cria (ou autoriza) o primeiro administrador. Executar SOMENTE pelo responsável pela implantação,
// em ambiente local e seguro. A chave de serviço nunca deve ser colocada em hospedagem pública.
//
// Uso:
//   node --env-file=.env.local scripts/create-admin.mjs criar admin@exemplo.com
//   node --env-file=.env.local scripts/create-admin.mjs resetar-mfa admin@exemplo.com
//
// A senha é lida de forma interativa (não aparece em histórico nem em argumentos).
import { createClient } from "@supabase/supabase-js";
import { createInterface } from "node:readline";

const [, , command, email] = process.argv;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || !command || !email) {
  console.error("Uso: create-admin.mjs <criar|resetar-mfa> <email>. Defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
    rl.question(question, (a) => { rl.close(); process.stdout.write("\n"); resolve(a); });
  });
}

function strongPassword(p) {
  return p.length >= 12 && /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p);
}

async function findUser() {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const u = data.users.find((x) => x.email?.toLowerCase() === email.toLowerCase());
    if (u) return u;
    if (data.users.length < 200) return null;
  }
  return null;
}

if (command === "criar") {
  let user = await findUser();
  if (!user) {
    const pw = await askHidden("Senha (mínimo 12 caracteres, com maiúscula, minúscula, número e símbolo): ");
    if (!strongPassword(pw)) { console.error("Senha fraca. Operação cancelada."); process.exit(1); }
    const { data, error } = await supabase.auth.admin.createUser({ email, password: pw, email_confirm: true });
    if (error) { console.error("Falha ao criar usuário:", error.message); process.exit(1); }
    user = data.user;
  }
  const { error } = await supabase.from("admin_users").upsert({ user_id: user.id });
  if (error) { console.error("Falha ao autorizar:", error.message); process.exit(1); }
  console.log(`Administrador autorizado: ${email}. No primeiro acesso, configure o segundo fator em /admin/mfa.`);
} else if (command === "resetar-mfa") {
  const user = await findUser();
  if (!user) { console.error("Usuário não encontrado."); process.exit(1); }
  const { data, error } = await supabase.auth.admin.mfa.listFactors({ userId: user.id });
  if (error) { console.error(error.message); process.exit(1); }
  for (const f of data.factors) await supabase.auth.admin.mfa.deleteFactor({ id: f.id, userId: user.id });
  console.log("Fatores removidos. O usuário deverá configurar um novo aplicativo autenticador no próximo acesso.");
} else {
  console.error("Comando desconhecido.");
  process.exit(1);
}
