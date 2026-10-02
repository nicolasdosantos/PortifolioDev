import type { Project } from "../types";

export const projects: Project[] = [
  {
    id: 5,
    title: "B4 Charge",
    accent: "#2563EB",
    description: {
      pt: "SaaS financeiro multiempresa para quem vende a prazo: gera as parcelas, cobra pelo WhatsApp e dá baixa sozinho quando o cliente paga.",
      en: "Multi-tenant financial SaaS for businesses that sell on credit: it generates installments, collects over WhatsApp and settles payments on its own.",
    },
    fullDesc: {
      pt: "Produto que estou construindo como fundador da Base4 Systems. A empresa cadastra clientes e vendas, e o sistema gera as parcelas automaticamente.\n\nA parte mais complexa que desenvolvi é o bot de cobrança: ele conversa com o cliente direto pelo WhatsApp, sem depender do WhatsApp Web, e faz a leitura automática de boletos e comprovantes de pagamento. O cliente paga por Pix, boleto ou link, e o pagamento confirmado vira parcela paga, recibo e lançamento no caixa. Também construí a arquitetura multi-tenant, que separa os dados de cada empresa, e um Painel Master para administrar a plataforma.",
      en: "A product I'm building as founder of Base4 Systems. The business registers customers and sales, and the system generates installments automatically.\n\nThe most complex part I built is the collection bot: it talks to customers directly over WhatsApp, without relying on WhatsApp Web, and automatically reads bank slips and payment receipts. Customers pay by Pix, bank slip or link, and a confirmed payment becomes a paid installment, a receipt and a cash-flow entry. I also built the multi-tenant architecture that keeps each company's data apart, and a Master Panel to run the platform.",
    },
    image: "/videos/b4-charge.jpg",
    video: "/videos/b4-charge.mp4",
    videoPreview: "/videos/b4-charge-preview.mp4",
    tags: ["React", "Node.js", "Express", "MySQL", "Multi-tenant", "WhatsApp API"],
    category: { pt: "SaaS", en: "SaaS" },
    status: "in_progress",
    year: "2025",
    featured: true,
    demo: "https://base4systems.com.br",
    demoLabel: { pt: "Site da Base4 Systems", en: "Base4 Systems website" },
    problem: {
      pt: "Empresas que vendem a prazo perdendo tempo com controle de caixa e cobrança manual de parcelas.",
      en: "Businesses that sell on credit losing time to manual cash control and installment collection.",
    },
    solution: {
      pt: "Parcelas geradas automaticamente, cobrança pelo WhatsApp com leitura de comprovantes e baixa automática no caixa, em uma arquitetura multi-tenant.",
      en: "Automatically generated installments, WhatsApp collection with receipt reading and automatic cash-flow settlement, on a multi-tenant architecture.",
    },
    results: {
      pt: "Na reta final de testes antes do lançamento comercial. O código é privado por ser um produto comercial.",
      en: "In final testing before the commercial launch. The code is private because it's a commercial product.",
    },
  },
  {
    id: 2,
    title: "Nexo — Controle Financeiro",
    accent: "#4352EA",
    description: {
      pt: "Finanças pessoais multiusuário: importa extrato OFX, divide uma compra em várias categorias e isola os dados de cada usuário com RLS.",
      en: "Multi-user personal finance: imports OFX statements, splits one purchase across categories and isolates each user's data with RLS.",
    },
    fullDesc: {
      pt: "Aplicação de finanças pessoais com transações, orçamentos, metas, investimentos e relatórios, feita com React, TypeScript e Supabase. Cada usuário só enxerga os próprios dados: todas as tabelas têm Row Level Security ligada a auth.users, então nem a chave pública consegue ler uma linha sem login.\n\nEscrevi um parser de extrato OFX que lê o arquivo bloco a bloco por regex, porque OFX quase nunca é XML válido, e marca duplicatas antes de importar. Uma compra dividida vira várias linhas ligadas por split_group_id, cada uma com sua categoria, e a busca global (Ctrl+K) encontra a compra pelo nome de um item. As funções financeiras e os parsers de importação têm testes com Vitest.",
      en: "A personal finance app with transactions, budgets, goals, investments and reports, built with React, TypeScript and Supabase. Each user only sees their own data: every table has Row Level Security tied to auth.users, so not even the public key can read a row without logging in.\n\nI wrote an OFX statement parser that reads the file block by block with regex, since OFX is almost never valid XML, and flags duplicates before importing. A split purchase becomes several rows linked by split_group_id, each with its own category, and the global search (Ctrl+K) finds a purchase by the name of one item. The financial functions and import parsers are tested with Vitest.",
    },
    image: "/videos/nexo-demo.jpg",
    video: "/videos/nexo-demo.mp4",
    videoPreview: "/videos/nexo-demo-preview.mp4",
    tags: ["React", "TypeScript", "Supabase", "PostgreSQL", "Vitest", "Vercel"],
    category: { pt: "Finanças", en: "Finance" },
    status: "completed",
    year: "2026",
    featured: true,
    github: "https://github.com/nicolasdosantos/Software-Financeiro",
    demo: "https://software-financeiro.vercel.app",
    problem: {
      pt: "Acompanhar para onde vai o dinheiro sem lançar cada gasto à mão, com os dados de cada pessoa protegidos.",
      en: "Tracking where the money goes without entering every expense by hand, with each person's data kept private.",
    },
    solution: {
      pt: "Importação de extrato OFX com detecção de duplicatas, compras divididas por categoria, busca global e RLS em todas as tabelas.",
      en: "OFX statement import with duplicate detection, purchases split by category, global search and RLS on every table.",
    },
    results: {
      pt: "Em produção na Vercel. Entre junho e outubro de 2026: 12 telas, 91 commits, 57 pull requests e 87 testes passando.",
      en: "Live on Vercel. Between June and October 2026: 12 screens, 91 commits, 57 pull requests and 87 passing tests.",
    },
  },
  {
    id: 1,
    title: "Obsidian",
    accent: "#C9A24D",
    description: {
      pt: "Projeto de estudo: landing page de uma marca fictícia de estética automotiva premium, feita para praticar React 19, TanStack Start e animações.",
      en: "Study project: a landing page for a fictional premium auto detailing brand, built to practice React 19, TanStack Start and animation.",
    },
    fullDesc: {
      pt: "Projeto pessoal para pôr meus estudos em prática. Criei a OBSIDIAN, uma marca fictícia de estética automotiva premium, e construí a landing page dela com TanStack Start, React 19 e Tailwind CSS v4, usando componentes shadcn/ui e animações com Motion.\n\nNão foi feito para um cliente: a marca, os textos e os depoimentos são fictícios. O objetivo era experimentar renderização no servidor e uma direção visual mais sofisticada do que eu tinha feito até então.",
      en: "A personal project to put my studies into practice. I created OBSIDIAN, a fictional premium auto detailing brand, and built its landing page with TanStack Start, React 19 and Tailwind CSS v4, using shadcn/ui components and Motion animations.\n\nIt wasn't made for a client: the brand, copy and testimonials are fictional. The goal was to try server-side rendering and a more refined visual direction than I had built before.",
    },
    image: "/projects/obsidian-hero.jpg",
    tags: ["React 19", "TypeScript", "TanStack Start", "Tailwind CSS v4", "shadcn/ui", "Motion"],
    category: { pt: "Projeto de estudo", en: "Study project" },
    status: "completed",
    year: "2026",
    featured: false,
    github: "https://github.com/nicolasdosantos/Obsidian",
    demo: "https://obsidian-eta-self.vercel.app",
    problem: {
      pt: "Eu queria praticar uma stack que ainda não conhecia (React 19 e TanStack Start) em um site com cara de produto real.",
      en: "I wanted to practice a stack I didn't know yet (React 19 and TanStack Start) on a site that looks like a real product.",
    },
    solution: {
      pt: "Inventei uma marca de estética automotiva e fiz a landing page dela com SSR, animações e um visual escuro e premium.",
      en: "I invented an auto detailing brand and built its landing page with SSR, animations and a dark, premium look.",
    },
    results: {
      pt: "No ar na Vercel. É um projeto de estudo: a marca e os depoimentos são fictícios.",
      en: "Live on Vercel. It's a study project: the brand and testimonials are fictional.",
    },
  },
  {
    id: 3,
    title: "Pokedex Full Stack",
    accent: "#DC2626",
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
    category: { pt: "Full Stack", en: "Full Stack" },
    status: "in_progress",
    year: "2026",
    featured: false,
    github: "https://github.com/nicolasdosantos/PokeIntegrado",
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
    accent: "#B45309",
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
    category: { pt: "Full Stack", en: "Full Stack" },
    status: "completed",
    year: "2024",
    featured: false,
    github: "https://github.com/nicolasdosantos/Biblioteca-web",
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
