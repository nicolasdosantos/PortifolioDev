import { Bot, Cpu, GraduationCap, Languages, ShieldCheck } from "lucide-react";
import { SiPython } from "react-icons/si";
import type { Certificate } from "../types";

export const certificates: Certificate[] = [
  { title: "Tecnologia em Análise e Desenvolvimento de Sistemas", issuer: "Unisalesiano", year: "2025-2027", color: "#7C3AED", icon: GraduationCap },
  { title: "Curso técnico em Análise e Desenvolvimento de Sistemas", issuer: "SENAI Avak Bedouian", year: "2023-2024", color: "#DC2626", icon: GraduationCap, hours: "800h" },
  { title: "Imersão Agentes IA", issuer: "Hashtag Treinamentos", year: "2026", color: "#0EA5E9", icon: Bot, hours: "8h", verifyUrl: "/certificado-imersao-agentes-ia-hashtag.pdf" },
  { title: "Jornada Python", issuer: "Hashtag Treinamentos", year: "2026", color: "#3776AB", icon: SiPython, hours: "8h", verifyUrl: "/certificado-jornada-python-hashtag.pdf" },
  { title: "Programação em Python", issuer: "SENAI Avak Bedouian", year: "2023-2024", color: "#3776AB", icon: SiPython, hours: "160h" },
  { title: "Python no Raspberry", issuer: "SENAI Avak Bedouian", year: "2024", color: "#EA580C", icon: Cpu, hours: "40h" },
  { title: "Cibersegurança com soluções Fortinet", issuer: "SENAI Avak Bedouian", year: "2024", color: "#059669", icon: ShieldCheck, hours: "40h" },
  { title: "Inglês", issuer: "Wizard", year: "2023", color: "#F59E0B", icon: Languages },
];
