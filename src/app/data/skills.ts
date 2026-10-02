import { Bot, Clapperboard, Database, Monitor, Server, Sparkles, Wrench } from "lucide-react";
import { FaJava } from "react-icons/fa";
import {
  SiClaude,
  SiDocker,
  SiFigma,
  SiFlask,
  SiGit,
  SiGooglegemini,
  SiJavascript,
  SiLaravel,
  SiLivewire,
  SiMariadb,
  SiMysql,
  SiN8N,
  SiNodedotjs,
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
      { name: "React", desc: "Hooks, Components, State", icon: SiReact, color: "#61DAFB" },
      { name: "TypeScript", desc: "Types, Interfaces", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", desc: "ES6+, DOM, Async", icon: SiJavascript, color: "#F7DF1E" },
      { name: "Tailwind CSS", desc: "Utility-first, Responsive", icon: SiTailwindcss, color: "#38BDF8" },
      /* Vinha do currículo (gen_cv.py) e não existia aqui. Sem ícone próprio no
         react-icons — React Native usa o mesmo logo do React. */
      { name: "React Native", desc: "Apps mobile multiplataforma", icon: SiReact, color: "#61DAFB" },
    ],
  },
  {
    id: "backend",
    label: { pt: "Backend", en: "Backend" },
    icon: Server,
    color: "#2563EB",
    skills: [
      /* Vinha do currículo (gen_cv.py) e do bloco de código do Hero, que já anunciava
         "Node" — mas não existia nesta lista. */
      { name: "Node.js", desc: "Runtime JS, npm, APIs", icon: SiNodedotjs, color: "#5FA04E" },
      { name: "PHP", desc: "APIs, Routing", icon: SiPhp, color: "#777BB4" },
      { name: "Laravel", desc: "MVC, Eloquent", icon: SiLaravel, color: "#FF2D20" },
      { name: "Livewire", desc: "Reactive components", icon: SiLivewire, color: "#4E56A6" },
      { name: "Python", desc: "Scripts, Automations", icon: SiPython, color: "#3776AB", colors: ["#3776AB", "#FFD43B"] },
      { name: "Flask", desc: "REST APIs, CRUD", icon: SiFlask, color: "#FFFFFF", lightColor: "#000000" },
      { name: "Java", desc: "OOP fundamentals", icon: FaJava, color: "#E76F00", colors: ["#E76F00", "#5382A1"] },
    ],
  },
  {
    id: "database",
    label: { pt: "Banco de Dados", en: "Database" },
    icon: Database,
    color: "#059669",
    skills: [
      { name: "MySQL", desc: "Queries, Relations", icon: SiMysql, color: "#4479A1" },
      { name: "MariaDB", desc: "Banco do estágio, com Laravel", icon: SiMariadb, color: "#C0765A" },
      { name: "Supabase", desc: "Postgres, Auth, Storage", icon: SiSupabase, color: "#3ECF8E", colors: ["#3ECF8E", "#249361"] },
    ],
  },
  {
    id: "tools",
    label: { pt: "Ferramentas", en: "Tools" },
    icon: Wrench,
    color: "#0891B2",
    skills: [
      { name: "Git", desc: "Versioning, GitHub", icon: SiGit, color: "#F05032" },
      { name: "Figma", desc: "Prototyping", icon: SiFigma, color: "#F24E1E", colors: ["#A259FF", "#F24E1E"] },
      { name: "Vercel", desc: "Deploys, Hosting", icon: SiVercel, color: "#FFFFFF", lightColor: "#000000" },
      { name: "Docker", desc: "Containers, ambiente local", icon: SiDocker, color: "#2496ED" },
      { name: "n8n", desc: "Automações de fluxo", icon: SiN8N, color: "#EA4B71" },
    ],
  },
  {
    id: "ai",
    label: { pt: "Inteligência Artificial", en: "Artificial Intelligence" },
    icon: Sparkles,
    color: "#D97757",
    skills: [
      { name: "ChatGPT", desc: "Prompting, automações", icon: Bot, color: "#74AA9C" },
      { name: "Claude", desc: "Coding agent, prompting", icon: SiClaude, color: "#D97757" },
      { name: "Gemini", desc: "Prompting, multimodal", icon: SiGooglegemini, color: "#4285F4", colors: ["#4796E3", "#9177C7"] },
      /* Higgsfield não tem ícone de marca no react-icons; Clapperboard (lucide) traduz
         geração de imagem e vídeo, que é o uso da plataforma. */
      { name: "Higgsfield", desc: "Geração de imagem e vídeo", icon: Clapperboard, color: "#A78BFA" },
    ],
  },
];
