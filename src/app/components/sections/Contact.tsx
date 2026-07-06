import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, Github, Linkedin, Mail, Phone, Send } from "lucide-react";
import type { Translation } from "../../types";
import { SectionHeader } from "../common";

interface ContactProps {
  dark: boolean;
  t: Translation;
}

const SOCIALS = [
  { Icon: Github, label: "GitHub", val: "github.com/nicolasdosantos", href: "https://github.com/nicolasdosantos" },
  { Icon: Linkedin, label: "LinkedIn", val: "linkedin.com/in/nicolas-pichiteli-dos-santos", href: "https://linkedin.com/in/nicolas-pichiteli-dos-santos" },
  { Icon: Mail, label: "Email", val: "nicolaspichiteli245@gmail.com", href: "mailto:nicolaspichiteli245@gmail.com" },
  { Icon: Phone, label: "WhatsApp", val: "+55 (18) 99614-8839", href: "https://wa.me/5518996148839" },
];

export function Contact({ dark, t }: ContactProps) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  const inputBase = `w-full px-4 py-3.5 rounded-xl border text-sm font-body outline-none transition-all duration-200 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.14)] ${dark ? "bg-white/[0.04] border-white/10 text-white placeholder:text-white/22" : "bg-black/[0.02] border-black/10 text-[#08080A] placeholder:text-black/28"}`;

  return (
    <section id="contato" className="py-32 relative">
      <div className="max-w-5xl mx-auto px-6">
        <SectionHeader label={t.contact_label} title={t.contact_title} dark={dark} />
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
          <div>
            <p className={`text-sm font-body leading-relaxed mb-10 ${dark ? "text-white/48" : "text-black/48"}`}>{t.contact_subtitle}</p>
            <div className="space-y-3">
              {SOCIALS.map(({ Icon, label, val, href }) => (
                <a
                  key={label}
                  href={href}
                  className={`group flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${dark ? "border-white/[0.07] bg-white/[0.025] hover:border-violet-500/30 hover:shadow-[0_0_20px_rgba(124,58,237,0.08)]" : "bg-white border-black/[0.07] hover:border-violet-300 hover:shadow-[0_4px_20px_rgba(124,58,237,0.07)]"}`}
                >
                  <div className="p-2 rounded-lg bg-violet-500/10 flex-shrink-0">
                    <Icon size={15} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-mono2 ${dark ? "text-white/28" : "text-black/28"}`}>{label}</div>
                    <div className={`text-sm font-body truncate ${dark ? "text-white/65" : "text-black/65"}`}>{val}</div>
                  </div>
                  <ArrowRight size={13} className={`opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${dark ? "text-violet-400" : "text-violet-600"}`} />
                </a>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder={t.form_name} required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={inputBase} />
              <input type="email" placeholder={t.form_email} required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className={inputBase} />
              <textarea placeholder={t.form_message} required rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className={`${inputBase} resize-none`} />
              <button
                type="submit"
                className={`w-full py-3.5 rounded-xl font-body font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 ${sent ? "bg-emerald-600 text-white" : "bg-violet-600 hover:bg-violet-500 text-white hover:shadow-[0_0_28px_rgba(124,58,237,0.4)] hover:-translate-y-0.5"}`}
              >
                {sent ? <><CheckCircle2 size={15} />{t.form_sent}</> : <><Send size={15} />{t.form_send}</>}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
