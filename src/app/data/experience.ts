import type { ExperienceItem } from "../types";

export const experience: ExperienceItem[] = [
  {
    role: { pt: "Estagiário de Desenvolvimento", en: "Development Intern" },
    company: "Agência VoêFly",
    period: { pt: "Abr 2026 — Presente", en: "Apr 2026 — Present" },
    type: { pt: "Estágio · Presencial", en: "Internship · On-site" },
    highlights: {
      pt: [
        "Desenvolvo e mantenho o site institucional multimarcas do grupo (ViajaFlux, VoêFly e eventos), com entregas e manutenções recorrentes e cuidado com a consistência visual e a responsividade entre as marcas.",
        "Colaboro na construção do portal de participantes do Viajaflux Summit, com múltiplos perfis de acesso (participante, patrocinador, organização e prestador de serviço), dimensionado para cerca de 2.000 participantes.",
        "Desenvolvi o segundo template padrão do recurso de criação de sites da ViajaFlux, em que o cliente monta o próprio site na plataforma, atuando no banco de dados e nas telas.",
        "Crio automações em Python para processos que antes eram feitos manualmente pela equipe.",
        "Corrijo bugs como formulários que não carregavam ou não enviavam os dados corretamente, buscando a causa raiz do problema.",
      ],
      en: [
        "I build and maintain the group's multi-brand corporate website (ViajaFlux, VoêFly and events), shipping recurring features and fixes while keeping visuals and responsiveness consistent across brands.",
        "I help build the Viajaflux Summit attendee portal, with multiple access roles (attendee, sponsor, organizer and service provider), sized for around 2,000 attendees.",
        "I built the second default template for ViajaFlux's site builder, where customers assemble their own site inside the platform, working on both the database and the screens.",
        "I build Python automations for processes the team used to handle manually.",
        "I fix bugs such as forms that failed to load or submit data correctly, tracking down the root cause.",
      ],
    },
    tags: ["PHP", "Laravel", "MariaDB", "Tailwind CSS", "DaisyUI", "Python"],
  },
  {
    role: { pt: "Jovem Aprendiz e Líder de Grupo", en: "Young Apprentice & Group Leader" },
    company: "SENAI Avak Bedouian",
    period: { pt: "2023 — 2024", en: "2023 — 2024" },
    type: { pt: "Jovem Aprendiz · Presencial", en: "Apprenticeship · On-site" },
    highlights: {
      pt: [
        "Liderei um grupo de 5 pessoas no desenvolvimento de um sistema de gerenciamento da biblioteca e do estoque da escola.",
        "Construí sozinho todo o backend do sistema, incluindo os CRUDs e a camada de segurança, com Python e banco de dados relacional.",
      ],
      en: [
        "Led a group of 5 people building a management system for the school's library and inventory.",
        "Built the system's entire backend on my own, including the CRUDs and the security layer, with Python and a relational database.",
      ],
    },
    tags: ["Python", "SQL", "CRUD"],
  },
];
