<div align="center">

# Portfólio — Nicolas Pichiteli dos Santos

Site pessoal com projetos, experiência e contato. Feito com **React 18**, **TypeScript**, **Tailwind CSS v4** e **Motion**, publicado na Vercel.

[![React](https://img.shields.io/badge/React_18-0A0A0F?style=flat-square&logo=react&logoColor=A78BFA)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-0A0A0F?style=flat-square&logo=typescript&logoColor=A78BFA)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-0A0A0F?style=flat-square&logo=tailwindcss&logoColor=A78BFA)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite_6-0A0A0F?style=flat-square&logo=vite&logoColor=A78BFA)](https://vitejs.dev)

[Ver o site](https://portifoliodev125.vercel.app/) · [Reportar bug](https://github.com/nicolasdosantos/PortifolioDev/issues)

</div>

<br/>

## Como este projeto foi feito

O layout inicial saiu do **Figma Make**. A partir dele reescrevi a estrutura e fui evoluindo o site, com apoio de IA (Claude) em parte do código. Tudo o que está aqui eu revisei e sei explicar. O que construí em cima da base:

- **Conteúdo separado dos componentes** — textos, projetos, skills, experiência e certificados ficam em `src/app/data/*.ts`, tipados. Atualizar o conteúdo não exige mexer em JSX.
- **PT/EN sem biblioteca** — um objeto `Translation` tipado (`src/app/types.ts`) com as duas línguas; o idioma é estado do `App` passado às seções.
- **Seção do cubo (`StackHero.tsx`)** — cubo e órbita da stack animados pelo scroll, respeitando `prefers-reduced-motion`.
- **Linha de scroll (`ScrollTrail.tsx`)** — um único caminho SVG gerado a partir da altura real da página e desenhado com `stroke-dashoffset` conforme a rolagem.
- **Confirmação antes de sair do site** — `useConfirmNavigate` + `ConfirmNavigateDialog` nos links de contato.
- **Rotas desconhecidas voltam para a home** — `vercel.json` em produção e um middleware no `vite.config.ts` no ambiente de desenvolvimento.
- **Currículo gerado por script** — `gen_cv.py` monta o PDF do currículo (PT e EN).
- **Acessibilidade** — `<main>` e link "Pular para o conteúdo", menu com links de verdade (`/#projetos` pode ser compartilhado e abre direto na seção), foco preso nos modais (`useFocusTrap`) e devolvido a quem abriu, labels no formulário, `lang` do HTML acompanhando o idioma e animações respeitando "reduzir movimento". Auditado com axe (WCAG 2.1 AA) nos dois temas, no desktop e no celular.

<br/>

## Stack

| Camada | Tecnologias |
|---|---|
| **Core** | React 18, TypeScript (strict), Vite 6 |
| **Estilo** | Tailwind CSS v4, tokens de tema em `src/styles/theme.css` |
| **Animação** | Motion |
| **Ícones** | lucide-react, react-icons |
| **Deploy** | Vercel (a partir do GitHub) |

<br/>

## Estrutura

```
src/
├── app/
│   ├── App.tsx            # composição das seções e estado de tema/idioma
│   ├── types.ts           # tipos do conteúdo (Translation, Project, SkillCategory...)
│   ├── data/              # conteúdo do site
│   ├── hooks/             # useHasHover, useIsMobile, useConfirmNavigate, useFocusTrap
│   ├── utils/             # goToSection (rolagem + âncora na URL)
│   └── components/
│       ├── layout/        # Navbar, Footer
│       ├── sections/      # Hero, About, Projects, Experience, Contact...
│       └── common/        # Intro, Aurora, Cursor, ScrollTrail, Reveal...
├── styles/                # tokens de tema, fontes, Tailwind
└── main.tsx
```

`App.tsx` guarda três estados (`dark`, `lang` e `done`, o fim da intro) e passa `dark`, `lang` e `t` (as strings do idioma atual) para cada seção. Não há store global.

<br/>

## Rodando localmente

```bash
npm install
npm run dev        # ambiente de desenvolvimento
npm run typecheck  # checagem de tipos (tsc, modo strict)
npm run build      # checagem de tipos + build de produção em dist/
npm run preview    # serve o build localmente
```

Requer Node 18+.

<br/>

## Próximos passos

- Testes automatizados (hoje a validação é a checagem de tipos no build, que a Vercel roda em cada PR).

<br/>

## Contato

**Nicolas Pichiteli dos Santos** — Desenvolvedor Full Stack · Birigui, SP

[LinkedIn](https://www.linkedin.com/in/nicolas-pichiteli-dos-santos-942a0b269) · [E-mail](mailto:nicolaspichiteli245@gmail.com) · [GitHub](https://github.com/nicolasdosantos)
