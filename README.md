<div align="center">

# Portfolio — Nicolas Pichiteli dos Santos

Site pessoal desenvolvido do zero com **React 18**, **TypeScript** e **Tailwind CSS v4**, com foco em performance, animações fluidas e uma arquitetura de conteúdo totalmente desacoplada dos componentes.

[![React](https://img.shields.io/badge/React_18-0A0A0F?style=flat-square&logo=react&logoColor=A78BFA)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-0A0A0F?style=flat-square&logo=typescript&logoColor=A78BFA)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-0A0A0F?style=flat-square&logo=tailwindcss&logoColor=A78BFA)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite_6-0A0A0F?style=flat-square&logo=vite&logoColor=A78BFA)](https://vitejs.dev)

[Demo](#) · [Reportar bug](https://github.com/nicolasdosantos/PortifolioDev/issues) · [Contato](#contato)

</div>

<br/>

## Sobre o projeto

Portfólio profissional com identidade visual escura e detalhes em roxo, construído com foco em três pilares:

- **Conteúdo como dado** — textos, projetos, skills, ferramentas e experiências vivem em `src/app/data/*.ts`, tipados e desacoplados de JSX. Alterar o conteúdo do site nunca exige tocar em um componente.
- **i18n nativo** — suporte a PT/EN via um objeto `Translation` central (`src/app/types.ts`), sem biblioteca externa de internacionalização.
- **Composição de seções** — a página é a soma de 14 seções independentes (`src/app/components/sections`), cada uma recebendo `dark`, `lang` e `t` (traduções) como props explícitas. Sem contexto global implícito, sem prop drilling excessivo.

<br/>

## Stack

| Camada | Tecnologias |
|---|---|
| **Core** | React 18, TypeScript, Vite 6 |
| **Estilo** | Tailwind CSS v4, tokens de tema em `src/styles/theme.css` |
| **UI Kit** | shadcn/ui (Radix UI primitives), Material UI (ícones) |
| **Animação** | Motion (Framer Motion), cursor customizado, aurora background |
| **Dados/Gráficos** | Recharts |
| **Utilitários** | `class-variance-authority`, `tailwind-merge`, `clsx`, `date-fns` |
| **Deploy** | Vercel |

<br/>

## Arquitetura

```
src/
├── app/
│   ├── App.tsx                 # composição das seções e estado global (tema/idioma)
│   ├── types.ts                # contratos de tipo (Translation, Project, SkillCategory...)
│   ├── data/                   # conteúdo do site — fonte única de verdade
│   │   ├── translations.ts     # strings PT/EN
│   │   ├── projects.ts         # projetos em destaque
│   │   ├── skills.ts           # skills por categoria, com nível e ícone
│   │   ├── tools.ts            # ferramentas do dia a dia
│   │   ├── experience.ts       # histórico profissional
│   │   └── certificates.ts     # certificações
│   ├── hooks/                  # hooks reutilizáveis (useCounter, useHasHover)
│   └── components/
│       ├── layout/              # Navbar, Footer
│       ├── sections/            # Hero, About, Skills, Projects, Contact...
│       ├── common/              # Aurora, Cursor, Intro, ScrollBar, GlobalStyles
│       └── ui/                  # primitivos shadcn/ui
├── styles/                      # design tokens, globals, fontes
└── main.tsx                     # entry point
```

**Fluxo de dados:** `App.tsx` mantém apenas três estados (`dark`, `lang`, `done`) e os propaga para cada seção. Nenhuma seção depende de contexto global — cada uma é testável isoladamente recebendo apenas as props que usa.

<br/>

## Como rodar localmente

```bash
# instalar dependências
pnpm install

# ambiente de desenvolvimento
pnpm dev

# build de produção
pnpm build
```

Requer Node 18+ e pnpm (workspace configurado em `pnpm-workspace.yaml`).

<br/>

## Destaques técnicos

- **Zero prop-context desnecessário** — tema e idioma são estado local elevado ao componente raiz, sem Redux/Zustand para um site que não precisa disso.
- **Assets tipados via alias** — import `figma:asset/*` resolvido em tempo de build por um plugin Vite customizado (`vite.config.ts`), permitindo assets versionados sem hardcode de caminho.
- **Tema via CSS custom properties** — dark/light mode alternado por classe (`document.documentElement.classList.toggle`) e tokens centralizados em `theme.css`, sem duplicar estilos por componente.
- **Performance** — code-splitting por seção, animações com `motion` apenas onde agregam percepção de qualidade (intro, aurora, scroll), evitando reflow/repaint desnecessário.

<br/>

## Contato

**Nicolas Pichiteli dos Santos** — Desenvolvedor Full Stack

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A0A0F?style=flat-square&logo=linkedin&logoColor=A78BFA)](https://linkedin.com/in/nicolas-pichiteli-dos-santos)
[![Email](https://img.shields.io/badge/Email-0A0A0F?style=flat-square&logo=gmail&logoColor=A78BFA)](mailto:nicolaspichiteli245@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-0A0A0F?style=flat-square&logo=github&logoColor=A78BFA)](https://github.com/nicolasdosantos)

<br/>

<div align="center">
<sub>Birigui, SP — Brasil</sub>
</div>
