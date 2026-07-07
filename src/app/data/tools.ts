import { Bot, Cloud, Code2, Database, MonitorCog, Palette, Workflow } from "lucide-react";
import { FaWindows } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import {
  SiClaude,
  SiDocker,
  SiFigma,
  SiGit,
  SiGithub,
  SiLinux,
  SiMysql,
  SiN8N,
  SiNpm,
  SiPhpmyadmin,
  SiSupabase,
  SiVercel,
} from "react-icons/si";
import type { ToolCategory } from "../types";

export const toolCategories: ToolCategory[] = [
  {
    icon: Code2,
    label: "Desenvolvimento",
    tools: [
      { name: "VS Code", icon: VscVscode, color: "#007ACC", href: "https://code.visualstudio.com/docs" },
      { name: "Git", icon: SiGit, color: "#F05032", href: "https://git-scm.com/doc" },
      { name: "GitHub", icon: SiGithub, color: "#FFFFFF", lightColor: "#181717", href: "https://docs.github.com" },
      { name: "npm", icon: SiNpm, color: "#CB3837", href: "https://docs.npmjs.com" },
      { name: "Docker", icon: SiDocker, color: "#2496ED", href: "https://docs.docker.com" },
    ],
  },
  {
    icon: Palette,
    label: "Design",
    tools: [
      { name: "Figma", icon: SiFigma, color: "#F24E1E", colors: ["#A259FF", "#F24E1E"], href: "https://help.figma.com" },
    ],
  },
  {
    icon: Bot,
    label: "IA",
    tools: [
      { name: "ChatGPT", icon: Bot, color: "#74AA9C", href: "https://help.openai.com" },
      { name: "Claude", icon: SiClaude, color: "#D97757", href: "https://docs.claude.com" },
    ],
  },
  {
    icon: Workflow,
    label: "Automação",
    tools: [
      { name: "n8n", icon: SiN8N, color: "#EA4B71", href: "https://docs.n8n.io" },
    ],
  },
  {
    icon: Cloud,
    label: "Cloud",
    tools: [
      { name: "Vercel", icon: SiVercel, color: "#FFFFFF", lightColor: "#000000", href: "https://vercel.com/docs" },
      { name: "Supabase", icon: SiSupabase, color: "#3ECF8E", colors: ["#3ECF8E", "#249361"], href: "https://supabase.com/docs" },
    ],
  },
  {
    icon: Database,
    label: "Banco de Dados",
    tools: [
      { name: "MySQL", icon: SiMysql, color: "#4479A1", href: "https://dev.mysql.com/doc" },
      { name: "phpMyAdmin", icon: SiPhpmyadmin, color: "#6C78AF", href: "https://docs.phpmyadmin.net" },
    ],
  },
  {
    icon: MonitorCog,
    label: "Sistema",
    tools: [
      { name: "Linux", icon: SiLinux, color: "#FFFFFF", lightColor: "#000000", href: "https://www.kernel.org/doc/html/latest" },
      { name: "Windows", icon: FaWindows, color: "#0078D6", colors: ["#00A4EF", "#F25022"], href: "https://learn.microsoft.com/windows" },
    ],
  },
];
