import { Database, Monitor, Server, Wrench } from "lucide-react";
import {
  SiFigma,
  SiFlask,
  SiGit,
  SiJavascript,
  SiLaravel,
  SiLivewire,
  SiMysql,
  SiOpenjdk,
  SiPhp,
  SiPython,
  SiReact,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";
import type { SkillCategory } from "../types";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: { pt: "Frontend", en: "Frontend" },
    icon: Monitor,
    color: "#7C3AED",
    skills: [
      { name: "React", level: 85, desc: "Hooks, Components, State", icon: SiReact },
      { name: "TypeScript", level: 75, desc: "Types, Interfaces", icon: SiTypescript },
      { name: "JavaScript", level: 88, desc: "ES6+, DOM, Async", icon: SiJavascript },
      { name: "Tailwind CSS", level: 82, desc: "Utility-first, Responsive", icon: SiTailwindcss },
    ],
  },
  {
    id: "backend",
    label: { pt: "Backend", en: "Backend" },
    icon: Server,
    color: "#2563EB",
    skills: [
      { name: "PHP", level: 78, desc: "APIs, Routing", icon: SiPhp },
      { name: "Laravel", level: 65, desc: "MVC, Eloquent", icon: SiLaravel },
      { name: "Livewire", level: 60, desc: "Reactive components", icon: SiLivewire },
      { name: "Python", level: 75, desc: "Scripts, Automations", icon: SiPython },
      { name: "Flask", level: 78, desc: "REST APIs, CRUD", icon: SiFlask },
      { name: "Java", level: 55, desc: "OOP fundamentals", icon: SiOpenjdk },
    ],
  },
  {
    id: "database",
    label: { pt: "Banco de Dados", en: "Database" },
    icon: Database,
    color: "#059669",
    skills: [
      { name: "MySQL", level: 80, desc: "Queries, Relations", icon: SiMysql },
      { name: "Supabase", level: 75, desc: "Postgres, Auth, Storage", icon: SiSupabase },
    ],
  },
  {
    id: "tools",
    label: { pt: "Ferramentas", en: "Tools" },
    icon: Wrench,
    color: "#0891B2",
    skills: [
      { name: "Git", level: 85, desc: "Versioning, GitHub", icon: SiGit },
      { name: "Figma", level: 60, desc: "Prototyping", icon: SiFigma },
      { name: "Vercel", level: 82, desc: "Deploys, Hosting", icon: SiVercel },
    ],
  },
];
