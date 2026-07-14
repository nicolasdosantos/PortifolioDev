import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, CheckCircle2, Clock, Github, Linkedin, Mail, MessageSquare, Phone, Send, User } from "lucide-react";
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
  { Icon: Linkedin, label: "LinkedIn", val: "linkedin.com/in/nicolas-pichiteli-dos-santos-942a0b269", href: "https://www.linkedin.com/in/nicolas-pichiteli-dos-santos-942a0b269", color: "#0A66C2" },
  { Icon: Mail, label: "Email", val: "nicolaspichiteli245@gmail.com", href: "mailto:nicolaspichiteli245@gmail.com", color: "#EA4335" },
  { Icon: Phone, label: "WhatsApp", val: "+55 (18) 99614-8839", href: "https://wa.me/5518996148839", color: "#25D366" },
];

export function Contact({ dark, t }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { pending, request, cancel, confirm } = useConfirmNavigate();
  const hasHover = useHasHover();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const inputBase = `w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-body outline-none transition-all duration-200 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.14)] ${dark ? "bg-white/[0.04] border-white/10 text-white placeholder:text-white/22" : "bg-black/[0.045] border-black/[0.16] text-[#08080A] placeholder:text-black/52"}`;

  return (
    <section id="contato" className="py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader label={t.contact_label} title={t.contact_title} dark={dark} />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 items-start lg:items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-sm font-body leading-relaxed mb-5 ${dark ? "text-white/48" : "text-black/68"}`}
            >
              {t.contact_subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 text-xs font-mono2 mb-8"
            >
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full w-1.5 h-1.5 bg-emerald-400" />
              </span>
              <Clock size={12} /> {t.contact_response_badge}
            </motion.div>

            <div className="space-y-2">
              {SOCIALS.map(({ Icon, label, val, href, color, lightColor }, i) => {
                const brand = dark ? color : lightColor ?? color;
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
                        style={{ background: `${brand}1a` }}
                      >
                        <Icon size={16} style={{ color: brand }} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className={`text-[10px] font-mono2 uppercase tracking-wide ${dark ? "text-white/35" : "text-black/50"}`}>{label}</div>
                      <div className={`text-sm font-body truncate ${dark ? "text-white/80" : "text-black/82"}`}>{val}</div>
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
            <motion.div
              className="absolute -inset-10 rounded-3xl -z-10 pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 70%)", filter: "blur(28px)", willChange: "opacity" }}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative"
              >
                <User size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? "text-white/30" : "text-black/40"}`} />
                <input type="text" placeholder={t.form_name} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputBase} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.18 }}
                className="relative"
              >
                <Mail size={15} className={`absolute left-4 top-1/2 -translate-y-1/2 ${dark ? "text-white/30" : "text-black/40"}`} />
                <input type="email" placeholder={t.form_email} required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputBase} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.26 }}
                className="relative"
              >
                <MessageSquare size={15} className={`absolute left-4 top-4 ${dark ? "text-white/30" : "text-black/40"}`} />
                <textarea placeholder={t.form_message} required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={`${inputBase} resize-none`} />
              </motion.div>

              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.34 }}
                whileHover={{ scale: 1.015, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                className="relative w-full py-3.5 rounded-xl font-body font-medium text-sm text-white overflow-hidden flex items-center justify-center gap-2"
                style={{
                  background: sent ? "linear-gradient(135deg, #059669, #10B981)" : "linear-gradient(135deg, #7C3AED, #6D28D9)",
                  boxShadow: sent ? "0 0 28px rgba(16,185,129,0.4)" : "0 0 28px rgba(124,58,237,0.35)",
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
                      {t.form_send}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
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
