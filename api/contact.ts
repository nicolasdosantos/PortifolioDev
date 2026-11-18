/* Envio do formulário de contato (Vercel Function). Valida os campos, barra robôs e
   excesso de envios e manda o e-mail pela API do Resend.

   Variáveis de ambiente (Vercel → Settings → Environment Variables):
   - RESEND_API_KEY  chave da API do Resend (obrigatória)
   - CONTACT_TO      e-mail que recebe as mensagens (obrigatória)
   - CONTACT_FROM    remetente; precisa ser de um domínio verificado no Resend. Sem domínio
                     próprio, "Portfólio <onboarding@resend.dev>" funciona, mas o Resend só
                     entrega para o e-mail da própria conta.

   A chave nunca vai para o navegador: só esta função a lê. */

/* o projeto não instala @types/node; a função só precisa ler variáveis de ambiente */
declare const process: { env: Record<string, string | undefined> };

const LIMITS = { name: 100, email: 200, message: 5000 };
const MIN_MESSAGE = 10;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Limite por IP: 3 envios a cada 10 minutos. Fica na memória da instância, então é uma
   barreira contra rajadas, não uma garantia (instâncias diferentes não compartilham). */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter(t => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

export async function POST(request: Request) {
  // só aceita envio do próprio site
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json(403, { error: "origin" });

  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return json(400, { error: "invalid" });
  }

  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim();
  const message = String(data.message ?? "").trim();
  const website = String(data.website ?? ""); // campo-isca: invisível para pessoas

  // robô preencheu o campo escondido: responde como sucesso e não envia nada
  if (website) return json(200, { ok: true });

  if (
    !name || name.length > LIMITS.name ||
    !EMAIL_RE.test(email) || email.length > LIMITS.email ||
    message.length < MIN_MESSAGE || message.length > LIMITS.message
  ) {
    return json(400, { error: "invalid" });
  }

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return json(429, { error: "rate" });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!key || !to) return json(500, { error: "config" });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfólio <onboarding@resend.dev>",
      to: [to],
      reply_to: email,
      subject: `Contato pelo portfólio — ${name}`,
      // texto puro: nada do que o visitante digitou é interpretado como HTML
      text: `${message}\n\n—\n${name}\n${email}`,
    }),
  });

  if (!res.ok) return json(502, { error: "send" });
  return json(200, { ok: true });
}
