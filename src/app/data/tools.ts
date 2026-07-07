import { VscVscode } from "react-icons/vsc";
import { SiClaude, SiFigma, SiGit, SiGithub, SiMysql, SiSupabase, SiVercel } from "react-icons/si";
import type { Tool } from "../types";

export const toolsList: Tool[] = [
  { name: "VS Code", icon: VscVscode },
  { name: "Git", icon: SiGit },
  { name: "GitHub", icon: SiGithub },
  { name: "Figma", icon: SiFigma },
  { name: "Vercel", icon: SiVercel },
  { name: "Supabase", icon: SiSupabase },
  { name: "MySQL", icon: SiMysql },
  { name: "Claude", icon: SiClaude },
];
