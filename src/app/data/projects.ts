import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: 1,
    title: "Obsidian",
    description: {
      pt: "Landing page premium para estética automotiva de alta performance: vitrificação cerâmica, PPF e polimento técnico.",
      en: "Premium landing page for a high-performance auto detailing studio: ceramic coating, PPF and technical polishing.",
    },
    fullDesc: {
      pt: "Landing page da OBSIDIAN Auto Detailing construída com TanStack Start, React 19 e Tailwind CSS v4, com componentes shadcn/ui e animações com Motion. Foco em performance, renderização no servidor e uma experiência visual sofisticada.",
      en: "Landing page for OBSIDIAN Auto Detailing built with TanStack Start, React 19 and Tailwind CSS v4, using shadcn/ui components and Motion animations. Focused on performance, server-side rendering and a polished visual experience.",
    },
    image: "/projects/obsidian.png",
    tags: ["React 19", "TypeScript", "TanStack Start", "Tailwind CSS v4", "shadcn/ui", "Motion"],
    category: "Landing Page",
    status: "completed",
    year: "2026",
    featured: true,
    github: "https://github.com/nicolasdosantos/Obsidian",
    demo: "https://obsidian-eta-self.vercel.app",
    problem: {
      pt: "Estúdio de estética automotiva sem presença digital que refletisse o padrão premium do serviço.",
      en: "Auto detailing studio without a digital presence reflecting the premium standard of its service.",
    },
    solution: {
      pt: "Landing page moderna com SSR, animações suaves e um design alinhado à identidade de alta performance da marca.",
      en: "Modern landing page with SSR, smooth animations and a design aligned with the brand's high-performance identity.",
    },
    results: {
      pt: "Site em produção, aplicando na prática uma stack moderna (React 19 + TanStack Start).",
      en: "Live site, putting a modern stack (React 19 + TanStack Start) into practice.",
    },
  },
  {
    id: 2,
    title: "Nexo — Controle Financeiro",
    description: {
      pt: "Plataforma para controle de receitas e despesas com dashboards, gráficos interativos e relatórios financeiros.",
      en: "Platform to manage income and expenses with dashboards, interactive charts and financial reports.",
    },
    fullDesc: {
      pt: "Plataforma para controle de receitas e despesas com dashboards, gráficos interativos e relatórios financeiros. Desenvolvida com React e Supabase, permitindo armazenamento em nuvem e acompanhamento financeiro de forma prática e intuitiva.",
      en: "Platform to manage income and expenses with dashboards, interactive charts and financial reports. Built with React and Supabase, enabling cloud storage and a practical, intuitive way to track personal finances.",
    },
    image: "/projects/nexo.png",
    tags: ["React", "TypeScript", "Supabase", "Vercel"],
    category: "Finanças",
    status: "completed",
    year: "2026",
    featured: false,
    github: "https://github.com/nicolasdosantos/Software-Financeiro",
    demo: "https://software-financeiro.vercel.app",
    problem: {
      pt: "Falta de uma ferramenta simples e visual para acompanhar receitas e despesas pessoais.",
      en: "Lack of a simple, visual tool to track personal income and expenses.",
    },
    solution: {
      pt: "Dashboard com gráficos interativos e armazenamento em nuvem via Supabase para acompanhamento financeiro em tempo real.",
      en: "Dashboard with interactive charts and Supabase cloud storage for real-time financial tracking.",
    },
    results: {
      pt: "Projeto pessoal em produção, usado para organizar as próprias finanças com dados sincronizados na nuvem.",
      en: "Personal project in production, used to organize personal finances with cloud-synced data.",
    },
  },
  {
    id: 3,
    title: "Pokedex Full Stack",
    description: {
      pt: "Sistema integrado à PokéAPI para consulta e gerenciamento de informações de Pokémon.",
      en: "System integrated with PokéAPI to search and manage Pokémon data.",
    },
    fullDesc: {
      pt: "Sistema full stack desenvolvido com React, PHP e MySQL, integrado à PokéAPI para consulta e gerenciamento de informações de Pokémon. O projeto utiliza consumo de APIs, banco de dados relacional, roteamento de páginas e interface responsiva para proporcionar uma experiência dinâmica ao usuário.",
      en: "Full stack system built with React, PHP, and MySQL, integrated with PokéAPI to search and manage Pokémon data. The project uses API consumption, a relational database, page routing, and a responsive interface to deliver a dynamic user experience.",
    },
    image: "/projects/Pokedex.png",
    tags: ["React", "PHP", "MySQL"],
    category: "Full Stack",
    status: "in_progress",
    year: "2026",
    featured: false,
    github: "https://github.com/nicolasdosantos/PokeIntegrado",
    demo: "https://github.com/nicolasdosantos/PokeIntegrado",
    problem: {
      pt: "Consultar e organizar informações de Pokémon de forma estruturada, unindo uma API externa a um banco próprio.",
      en: "Query and organize Pokémon data in a structured way, combining an external API with a custom database.",
    },
    solution: {
      pt: "Integração com a PokéAPI, persistência em MySQL e interface em React com backend em PHP para gerenciar os dados.",
      en: "Integration with PokéAPI, MySQL persistence and a React interface with a PHP backend to manage the data.",
    },
    results: {
      pt: "Projeto em fase beta, usado para praticar consumo de APIs, banco de dados relacional e arquitetura full stack.",
      en: "Project in beta, used to practice API consumption, relational databases and full-stack architecture.",
    },
  },
  {
    id: 4,
    title: "Biblioteca Web + API",
    description: {
      pt: "Aplicação para cadastro, consulta e gerenciamento de acervo de biblioteca, com API REST em Flask.",
      en: "Application to register, search and manage a library's book collection, with a Flask REST API.",
    },
    fullDesc: {
      pt: "Plataforma desenvolvida para controle de livros e organização do acervo de uma biblioteca, permitindo cadastro, consulta e gerenciamento de exemplares por meio de uma interface intuitiva e responsiva. O backend é uma API REST em Flask com operações completas de CRUD, integrada a um banco de dados MySQL para persistência das informações.",
      en: "A platform built to manage books and organize a library's collection, allowing registration, search and management of items through an intuitive, responsive interface. The backend is a Flask REST API with full CRUD operations, integrated with a MySQL database for data persistence.",
    },
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&h=450&fit=crop&auto=format",
    tags: ["React", "React Native", "JavaScript", "Python", "Flask", "MySQL"],
    category: "Full Stack",
    status: "completed",
    year: "2024",
    featured: false,
    github: "https://github.com/nicolasdosantos/Biblioteca-web",
    demo: "https://github.com/nicolasdosantos/Biblioteca-web",
    problem: {
      pt: "Bibliotecas sem um sistema simples para cadastrar, consultar e controlar o acervo de livros.",
      en: "Libraries without a simple system to register, search and control their book collection.",
    },
    solution: {
      pt: "API REST em Flask com CRUD completo integrada a um banco MySQL, com interface web em React para o dia a dia da biblioteca.",
      en: "A Flask REST API with full CRUD integrated with a MySQL database, paired with a React web interface for daily library use.",
    },
    results: {
      pt: "Sistema funcional usado para praticar arquitetura de API REST, organização de rotas e boas práticas de backend.",
      en: "Functional system used to practice REST API architecture, route organization and backend best practices.",
    },
  },
];
