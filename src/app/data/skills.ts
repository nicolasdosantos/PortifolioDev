import { Database, Monitor, Server, Wrench } from "lucide-react";
import type { SkillCategory } from "../types";

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: { pt: "Frontend", en: "Frontend" },
    icon: Monitor,
    color: "#7C3AED",
    skills: [
      { name: "React", level: 85, desc: "Hooks, Components, State" },
      { name: "TypeScript", level: 75, desc: "Types, Interfaces" },
      { name: "JavaScript", level: 88, desc: "ES6+, DOM, Async" },
      { name: "Tailwind CSS", level: 82, desc: "Utility-first, Responsive" },
    ],
  },
  {
    id: "backend",
    label: { pt: "Backend", en: "Backend" },
    icon: Server,
    color: "#2563EB",
    skills: [
      { name: "PHP", level: 78, desc: "APIs, Routing" },
      { name: "Laravel", level: 65, desc: "MVC, Eloquent" },
      { name: "Livewire", level: 60, desc: "Reactive components" },
      { name: "Python", level: 75, desc: "Scripts, Automations" },
      { name: "Flask", level: 78, desc: "REST APIs, CRUD" },
      { name: "Java", level: 55, desc: "OOP fundamentals" },
    ],
  },
  {
    id: "database",
    label: { pt: "Banco de Dados", en: "Database" },
    icon: Database,
    color: "#059669",
    skills: [
      { name: "MySQL", level: 80, desc: "Queries, Relations" },
      { name: "Supabase", level: 75, desc: "Postgres, Auth, Storage" },
    ],
  },
  {
    id: "tools",
    label: { pt: "Ferramentas", en: "Tools" },
    icon: Wrench,
    color: "#0891B2",
    skills: [
      { name: "Git", level: 85, desc: "Versioning, GitHub" },
      { name: "Figma", level: 60, desc: "Prototyping" },
      { name: "Vercel", level: 82, desc: "Deploys, Hosting" },
    ],
  },
];
