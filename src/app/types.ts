import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

export type Lang = "pt" | "en";

export interface LocalizedText {
  pt: string;
  en: string;
}

export interface ProcessStep {
  title: string;
  desc: string;
}

export interface Translation {
  nav: string[];
  badge: string;
  fullName: string;
  role: string;
  /** Stack principal ao lado do cargo, no hero. */
  role_stack: string;
  description: string;
  cta_projects: string;
  cta_contact: string;
  cta_cv: string;
  location: string;
  scroll_hint: string;
  about_label: string;
  about_title: string;
  about_bio: string;
  projects_label: string;
  projects_title: string;
  experience_label: string;
  experience_title: string;
  contact_label: string;
  contact_title: string;
  contact_subtitle: string;
  contact_response_badge: string;
  /** Labels visíveis do formulário; os *_ph são os exemplos dentro dos campos. */
  form_name: string;
  form_email: string;
  form_message: string;
  form_name_ph: string;
  form_email_ph: string;
  form_message_ph: string;
  /** Explica que o envio abre o app de e-mail (não há backend). */
  form_hint: string;
  /** Acessibilidade: link de pular, nomes dos botões só com ícone. */
  skip_to_content: string;
  go_home: string;
  theme_to_light: string;
  theme_to_dark: string;
  theme_light: string;
  theme_dark: string;
  lang_switch: string;
  form_send: string;
  form_sent: string;
  process_label: string;
  process_title: string;
  certs_label: string;
  certs_title: string;
  certs_stat_certs: string;
  certs_stat_institutions: string;
  certs_stat_hours: string;
  certs_verified: string;
  certs_verify_hint: string;
  certs_completed: string;
  certs_in_progress: string;
  completed: string;
  in_progress: string;
  all_rights: string;
  footer_tagline: string;
  back_top: string;
  process_steps: ProcessStep[];
}

export interface SkillItem {
  name: string;
  desc: string;
  icon: IconType;
  color: string;
  /** Alternate brand color used on light backgrounds when `color` is too light to read. */
  lightColor?: string;
  /** When the brand logo is multi-color, the full gradient stop sequence. */
  colors?: string[];
}

export interface SkillCategory {
  id: string;
  label: LocalizedText;
  icon: LucideIcon;
  color: string;
  skills: SkillItem[];
}

export type ProjectStatus = "completed" | "in_progress";

export interface Project {
  id: number;
  title: string;
  description: LocalizedText;
  /** Texto do modal. Parágrafos separados por linha em branco (\n\n). */
  fullDesc: LocalizedText;
  image: string;
  tags: string[];
  category: LocalizedText;
  status: ProjectStatus;
  year: string;
  featured: boolean;
  /** Cor de destaque do projeto (brilho e botões do modal). Tirada do vídeo ou da imagem. */
  accent?: string;
  /** Repositório público. Omitir quando o código é privado: o modal avisa em vez de linkar. */
  github?: string;
  /** Link de demonstração online. Omitir quando não há demo: o modal mostra só o código. */
  demo?: string;
  /** Rótulo do botão de demo quando o link não é o app em si (ex.: site institucional). */
  demoLabel?: LocalizedText;
  /** Vídeo completo em public/videos, tocado com controles e som no modal. */
  video?: string;
  /** Recorte curto e sem áudio só com as telas do produto, em loop no card. Sem ele, o card usa `video`. */
  videoPreview?: string;
  problem: LocalizedText;
  solution: LocalizedText;
  results: LocalizedText;
}

export interface ExperienceItem {
  role: LocalizedText;
  company: string;
  period: LocalizedText;
  type: LocalizedText;
  /** Entregas concretas, uma por item: viram a lista do card. */
  highlights: { pt: string[]; en: string[] };
  tags: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  year: string;
  color: string;
  /** lucide ou react-icons (ex.: o logo do Python vem do react-icons) */
  icon: LucideIcon | IconType;
  hours?: string;
  /** Formação ainda em curso: exibe "Em andamento" e não entra na contagem de certificados. */
  inProgress?: boolean;
  /** Public link to the issuer's validation document, when one exists. */
  verifyUrl?: string;
}

/** Shared props for full sections that need theme, language and copy. */
export interface SectionProps {
  dark: boolean;
  lang: Lang;
  t: Translation;
}

/** An external link awaiting user confirmation before navigating away, shown via ConfirmNavigateDialog. */
export interface PendingLink {
  name: string;
  href: string;
  icon: IconType | LucideIcon;
  colors: string[];
}
