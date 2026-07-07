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

export interface FaqItem {
  q: string;
  a: string;
}

export interface Translation {
  nav: string[];
  badge: string;
  name: string;
  fullName: string;
  role: string;
  description: string;
  cta_projects: string;
  cta_contact: string;
  cta_cv: string;
  location: string;
  scroll_hint: string;
  about_label: string;
  about_title: string;
  about_bio: string;
  skills_label: string;
  skills_title: string;
  projects_label: string;
  projects_title: string;
  experience_label: string;
  experience_title: string;
  contact_label: string;
  contact_title: string;
  contact_subtitle: string;
  form_name: string;
  form_email: string;
  form_message: string;
  form_send: string;
  form_sent: string;
  journey_label: string;
  journey_title: string;
  process_label: string;
  process_title: string;
  tools_label: string;
  tools_title: string;
  blog_label: string;
  blog_title: string;
  blog_coming: string;
  faq_label: string;
  faq_title: string;
  certs_label: string;
  certs_title: string;
  github_label: string;
  github_title: string;
  stats_label: string;
  stat_projects: string;
  stat_commits: string;
  stat_techs: string;
  stat_years: string;
  stat_certs: string;
  completed: string;
  in_progress: string;
  all_rights: string;
  footer_tagline: string;
  read_more: string;
  back_top: string;
  process_steps: ProcessStep[];
  faq_items: FaqItem[];
}

export interface SkillItem {
  name: string;
  level: number;
  desc: string;
  icon: IconType;
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
  fullDesc: LocalizedText;
  image: string;
  tags: string[];
  category: string;
  status: ProjectStatus;
  year: string;
  featured: boolean;
  github: string;
  demo: string;
  problem: LocalizedText;
  solution: LocalizedText;
  results: LocalizedText;
}

export interface JourneyItem {
  year: string;
  title: LocalizedText;
  desc: LocalizedText;
}

export interface ExperienceItem {
  role: LocalizedText;
  company: string;
  period: LocalizedText;
  type: LocalizedText;
  desc: LocalizedText;
  tags: string[];
}

export interface Certificate {
  title: string;
  issuer: string;
  year: string;
  color: string;
}

export interface Tool {
  name: string;
  icon: IconType;
}

/** Shared props for full sections that need theme, language and copy. */
export interface SectionProps {
  dark: boolean;
  lang: Lang;
  t: Translation;
}
