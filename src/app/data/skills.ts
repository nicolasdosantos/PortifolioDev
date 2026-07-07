import { Bot, Database, Monitor, Server, Sparkles, Wrench } from "lucide-react";
import { FaJava } from "react-icons/fa";
import {
  SiClaude,
  SiFigma,
  SiFlask,
  SiGit,
  SiJavascript,
  SiLaravel,
  SiLivewire,
  SiMysql,
  SiPhp,
  SiPhpmyadmin,
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
      { name: "React", level: 85, desc: "Hooks, Components, State", icon: SiReact, color: "#61DAFB", href: "https://react.dev" },
      { name: "TypeScript", level: 75, desc: "Types, Interfaces", icon: SiTypescript, color: "#3178C6", href: "https://www.typescriptlang.org/docs" },
      { name: "JavaScript", level: 88, desc: "ES6+, DOM, Async", icon: SiJavascript, color: "#F7DF1E", href: "https://developer.mozilla.org/docs/Web/JavaScript" },
      { name: "Tailwind CSS", level: 82, desc: "Utility-first, Responsive", icon: SiTailwindcss, color: "#38BDF8", href: "https://tailwindcss.com/docs" },
    ],
  },
  {
    id: "backend",
    label: { pt: "Backend", en: "Backend" },
    icon: Server,
    color: "#2563EB",
    skills: [
      { name: "PHP", level: 78, desc: "APIs, Routing", icon: SiPhp, color: "#777BB4", href: "https://www.php.net/docs.php" },
      { name: "Laravel", level: 65, desc: "MVC, Eloquent", icon: SiLaravel, color: "#FF2D20", href: "https://laravel.com/docs" },
      { name: "Livewire", level: 60, desc: "Reactive components", icon: SiLivewire, color: "#4E56A6", href: "https://livewire.laravel.com/docs" },
      { name: "Python", level: 75, desc: "Scripts, Automations", icon: SiPython, color: "#3776AB", colors: ["#3776AB", "#FFD43B"], href: "https://docs.python.org/3" },
      { name: "Flask", level: 78, desc: "REST APIs, CRUD", icon: SiFlask, color: "#FFFFFF", lightColor: "#000000", href: "https://flask.palletsprojects.com" },
      { name: "Java", level: 55, desc: "OOP fundamentals", icon: FaJava, color: "#E76F00", colors: ["#E76F00", "#5382A1"], href: "https://docs.oracle.com/en/java" },
    ],
  },
  {
    id: "database",
    label: { pt: "Banco de Dados", en: "Database" },
    icon: Database,
    color: "#059669",
    skills: [
      { name: "MySQL", level: 80, desc: "Queries, Relations", icon: SiMysql, color: "#4479A1", href: "https://dev.mysql.com/doc" },
      { name: "phpMyAdmin", level: 78, desc: "Admin, Queries visuais", icon: SiPhpmyadmin, color: "#6C78AF", href: "https://www.phpmyadmin.net/docs" },
      { name: "Supabase", level: 75, desc: "Postgres, Auth, Storage", icon: SiSupabase, color: "#3ECF8E", colors: ["#3ECF8E", "#249361"], href: "https://supabase.com/docs" },
    ],
  },
  {
    id: "tools",
    label: { pt: "Ferramentas", en: "Tools" },
    icon: Wrench,
    color: "#0891B2",
    skills: [
      { name: "Git", level: 85, desc: "Versioning, GitHub", icon: SiGit, color: "#F05032", href: "https://git-scm.com/doc" },
      { name: "Figma", level: 60, desc: "Prototyping", icon: SiFigma, color: "#F24E1E", colors: ["#A259FF", "#F24E1E"], href: "https://help.figma.com" },
      { name: "Vercel", level: 82, desc: "Deploys, Hosting", icon: SiVercel, color: "#FFFFFF", lightColor: "#000000", href: "https://vercel.com/docs" },
    ],
  },
  {
    id: "ai",
    label: { pt: "Inteligência Artificial", en: "Artificial Intelligence" },
    icon: Sparkles,
    color: "#D97757",
    skills: [
      { name: "ChatGPT", level: 85, desc: "Prompting, automações", icon: Bot, color: "#74AA9C", href: "https://help.openai.com" },
      { name: "Claude", level: 88, desc: "Coding agent, prompting", icon: SiClaude, color: "#D97757", href: "https://docs.claude.com" },
    ],
  },
];
