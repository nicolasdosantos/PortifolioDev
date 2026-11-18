import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Briefcase, CheckCircle2, Github, Linkedin, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
import type { Translation } from "../../types";
import { ConfirmNavigateDialog, SectionHeader } from "../common";
import { useHasHover } from "../../hooks/useHasHover";
import { useConfirmNavigate } from "../../hooks/useConfirmNavigate";

interface ContactProps {
  dark: boolean;
  t: Translation;
}

const SOCIALS = [
  { Icon: Github, label: "GitHub", val: "github.com/nicolasdosantos", href: "https://github.com/nicolasdosantos", color: "#FFFFFF", lightColor: "#181717" },
  /* `val` mostra a forma curta do perfil: a URL completa tem 54 caracteres e era cortada
     pelo `truncate` já em telas de 390px, sobrando "linkedin.com/in/nicolas-pi…". */
  { Icon: Linkedin, label: "LinkedIn", val: "in/nicolas-pichiteli-dos-santos", href: "https://www.linkedin.com/in/nicolas-pichiteli-dos-santos-942a0b269", color: "#0A66C2" },
  { Icon: Mail, label: "Email", val: "nicolaspichiteli245@gmail.com", href: "mailto:nicolaspichiteli245@gmail.com", color: "#EA4335" },
  { Icon: Phone, label: "WhatsApp", val: "+55 (18) 99614-8839", href: "https://wa.me/5518996148839", color: "#25D366" },
];

export function Contact({ dark, t }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [hovered, setHovered] = useState<string | null>(null);
  const { pending, request, cancel, confirm } = useConfirmNavigate();
  const hasHover = useHasHover();

  /* Envio real pela função /api/contact (Resend). Se falhar, a mensagem de erro oferece o
     e-mail direto, com o texto já escrito, para a pessoa não perder o que digitou. */
  const MAIL_TO = "nicolaspichiteli245@gmail.com";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [website, setWebsite] = useState(""); // campo-isca para robôs
  const sent = status === "sent";

  const mailtoFallback = `mailto:${MAIL_TO}?subject=${encodeURIComponent(`Contato pelo portfólio — ${form.name}`)}&body=${encodeURIComponent(`${form.message}\n\n—\n${form.name}\n${form.email}`)}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("error");
    }
  };

  const labelBase = `block mb-1.5 text-xs font-body font-medium ${dark ? "text-white/70" : "text-black/70"}`;
  const iconBase = `absolute left-4 ${dark ? "text-white/50" : "text-black/70"}`;
  const inputBase = `w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-body outline-none transition-all duration-200 focus:border-brand-ink focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--p-accent-ink)_8%,transparent)] ${dark ? "bg-[#101016]/95 border-white/[0.12] text-white placeholder:text-white/50" : "bg-black/[0.045] border-black/[0.16] text-[color:var(--p-bg)] placeholder:text-black/70"}`;

  return (
    <section id="contato" className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <SectionHeader label={t.contact_label} title={t.contact_title} dark={dark} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-sm font-body leading-relaxed mb-5 ${dark ? "text-white/70" : "text-black/70"}`}
            >
              {t.contact_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-brand-ink/30 bg-brand-ink/10 text-brand-ink text-xs font-body mb-8"
            >
              <Briefcase size={12} /> {t.contact_response_badge}
            </motion.div>

            <div className="space-y-2">
              {SOCIALS.map(({ Icon, label, val, href, color, lightColor }, i) => {
                /* Ícones na cor da paleta, não na da marca: verde, azul, vermelho e branco lado a lado
                   quebravam a harmonia. `color`/`lightColor` ficam nos dados, sem uso aqui. */
                void color; void lightColor;
                const brand = dark ? "var(--p-secondary)" : "var(--p-bg)";
                const isHovered = hasHover ? hovered === label : true;
                return (
                  <motion.button
                    key={label}
                    type="button"
                    onClick={() => request({ name: label, href, icon: Icon, colors: [brand, brand] })}
                    initial={{ opacity: 0, x: -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
                    onHoverStart={() => hasHover && setHovered(label)}
                    onHoverEnd={() => hasHover && setHovered(null)}
                    className="relative flex items-center gap-4 py-3 pl-5 pr-4 rounded-xl overflow-hidden transition-colors duration-300 w-full text-left"
                    style={{ background: isHovered ? (dark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.035)") : "transparent" }}
                  >
                    <motion.span
                      className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full origin-bottom"
                      style={{ background: brand }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    />

                    <div className="relative flex-shrink-0 w-11 h-11">
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{ border: `1.5px solid ${brand}`, opacity: isHovered ? 0.6 : 0.2 }}
                        animate={{ scale: isHovered ? 1.15 : 1, opacity: isHovered ? [0.6, 0.15, 0.6] : 0.2 }}
                        transition={{ duration: 1.6, repeat: isHovered && hasHover ? Infinity : 0, ease: "easeInOut" }}
                      />
                      <div
                        className="relative w-11 h-11 rounded-full flex items-center justify-center transition-colors duration-300"
                        style={{ background: `color-mix(in srgb, ${brand} 7%, transparent)` }}
                      >
                        <Icon size={16} style={{ color: brand }} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-body uppercase tracking-wide ${dark ? "text-white/50" : "text-black/70"}`}>{label}</div>
                      <div className={`text-sm font-body truncate ${dark ? "text-white/90" : "text-black/85"}`}>{val}</div>
                    </div>

                    <motion.div
                      animate={{ x: isHovered ? 3 : 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="flex-shrink-0"
                    >
                      <ArrowRight size={14} style={{ color: brand, opacity: isHovered ? 1 : 0.4 }} />
                    </motion.div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* campo-isca: escondido de pessoas e leitores de tela; robôs costumam preencher */}
              <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
                <label htmlFor="contato-site">Site</label>
                <input id="contato-site" name="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                {/* Label visível: o placeholder some ao digitar e não serve de rótulo. */}
                <label htmlFor="contato-nome" className={labelBase}>{t.form_name}</label>
                <div className="relative">
                  <User size={15} aria-hidden className={`${iconBase} top-1/2 -translate-y-1/2`} />
                  <input id="contato-nome" name="name" type="text" autoComplete="name" placeholder={t.form_name_ph} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputBase} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.18 }}
              >
                <label htmlFor="contato-email" className={labelBase}>{t.form_email}</label>
                <div className="relative">
                  <Mail size={15} aria-hidden className={`${iconBase} top-1/2 -translate-y-1/2`} />
                  <input id="contato-email" name="email" type="email" autoComplete="email" placeholder={t.form_email_ph} required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputBase} />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.26 }}
              >
                <label htmlFor="contato-mensagem" className={labelBase}>{t.form_message}</label>
                <div className="relative">
                  <MessageSquare size={15} aria-hidden className={`${iconBase} top-4`} />
                  <textarea id="contato-mensagem" name="message" placeholder={t.form_message_ph} required rows={5} minLength={10} maxLength={5000} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={`${inputBase} resize-none`} />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={status === "sending"}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.34 }}
                whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-3.5 rounded-xl font-body font-medium text-sm text-[color:var(--p-on-accent)] overflow-hidden flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, var(--p-accent), var(--p-accent-strong))",
                  opacity: status === "sending" ? 0.7 : 1,
                  boxShadow: "none",
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {sent ? (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
                      >
                        <CheckCircle2 size={15} />
                      </motion.span>
                      {t.form_sent}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="send"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ x: 26, y: -22, opacity: 0, rotate: 35, scale: 0.5, transition: { duration: 0.35, ease: "easeIn" } }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <motion.span
                        className="inline-flex"
                        whileHover={{ x: 3, y: -3, rotate: -18 }}
                        animate={{ y: [0, -2, 0] }}
                        transition={{ y: { duration: 1.6, repeat: Infinity, ease: "easeInOut" }, default: { type: "spring", stiffness: 300, damping: 12 } }}
                      >
                        <Send size={15} />
                      </motion.span>
                      {status === "sending" ? t.form_sending : t.form_send}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
              {status === "error" ? (
                <p role="alert" className="text-xs font-body text-center text-brand-ink">
                  {t.form_error}{" "}
                  <a href={mailtoFallback} className="underline underline-offset-2">{t.form_error_mail}</a>
                </p>
              ) : (
                <p className={`text-xs font-body text-center ${dark ? "text-white/50" : "text-black/70"}`}>{t.form_hint}</p>
              )}
              {/* anuncia para leitor de tela o que o botão animado mostra visualmente */}
              <p role="status" aria-live="polite" className="sr-only">{sent ? t.form_sent : status === "sending" ? t.form_sending : ""}</p>
            </form>
          </motion.div>
        </div>
      </div>

      <ConfirmNavigateDialog
        pending={pending}
        dark={dark}
        title="Abrir link externo?"
        description={pending ? `Você será redirecionado para ${pending.name}.` : undefined}
        onCancel={cancel}
        onConfirm={confirm}
      />
    </section>
  );
}
