# -*- coding: utf-8 -*-
"""Rebuilds Nicolas' three CVs as HTML, preserving the original two-column design
and adding the two new Hashtag certificates with short descriptions."""
import base64, io, os, pathlib

PUB = pathlib.Path("/home/nicolas/Documentos/porti/public")
OUT = pathlib.Path(__file__).parent

photo_b64 = base64.b64encode((PUB / "profile.jpg").read_bytes()).decode()

# ---------------------------------------------------------------- shared data
CONTACT = dict(
    local="Birigui - SP, Brasil",
    local_en="Birigui - SP, Brazil",
    email="nicolaspichiteli245@gmail.com",
    phone="+55 (18) 99614-8839",
    github="github.com/nicolasdosantos",
    linkedin="linkedin.com/in/nicolas-pichiteli-dos-santos-942a0b269",
)

SKILLS = [
    ("Frontend", ["React", "TypeScript", "JavaScript", "Tailwind CSS"]),
    ("Backend", ["PHP", "Laravel", "Python", "Flask", "Java"]),
    ("__DB__", ["MySQL", "phpMyAdmin", "Supabase"]),
    ("__TOOLS__", ["Git", "Figma", "Vercel", "ChatGPT", "Claude"]),
]

# newest first; colour matches the portfolio palette
CERTS = [
    ("#0EA5E9", "Imersão Agentes IA", "AI Agents Immersion",
     "Hashtag Treinamentos · 2026 · 8h",
     "Agentes de IA integrando LLMs a ferramentas e fontes de dados externas.",
     "AI agents integrating LLMs with external tools and data sources."),
    ("#3776AB", "Jornada Python", "Python Journey",
     "Hashtag Treinamentos · 2026 · 8h",
     "Python para automação e manipulação de dados, com leitura e escrita em bases.",
     "Python for automation and data handling, reading from and writing to databases."),
    ("#059669", "Cibersegurança com soluções Fortinet", "Cybersecurity with Fortinet Solutions",
     "SENAI Avak Bedouian · 2024 · 40h",
     "Firewall, segmentação de rede, controle de acesso e proteção de dados.",
     "Firewall, network segmentation, access control and data protection."),
    ("#EA580C", "Python no Raspberry", "Python on Raspberry Pi",
     "SENAI Avak Bedouian · 2024 · 40h",
     "Coleta de dados de sensores, persistência em banco local e automação IoT.",
     "Sensor data collection, local database persistence and IoT automation."),
    ("#7C3AED", "Programação em Python", "Python Programming",
     "SENAI Avak Bedouian · 2023-2024 · 160h",
     "Lógica, estruturas de dados, POO e integração com bancos relacionais.",
     "Logic, data structures, OOP and integration with relational databases."),
    ("#F59E0B", "Inglês", "English",
     "Wizard · 2023",
     "Leitura de documentação técnica, escrita e conversação.",
     "Technical documentation reading, writing and conversation."),
]

PROJECTS = [
    ("Obsidian Auto Detailing", "2026",
     "Landing page premium para estética automotiva de alta performance, construída com TanStack Start, React 19 e Tailwind CSS v4.",
     "Premium landing page for a high-performance auto detailing studio, built with TanStack Start, React 19 and Tailwind CSS v4.",
     ["React 19", "TypeScript", "TanStack Start", "Motion"]),
    ("Nexo — Controle Financeiro", "2026",
     "Plataforma para controle de receitas e despesas com dashboards, gráficos interativos e relatórios financeiros.",
     "Platform to manage income and expenses with dashboards, interactive charts and financial reports.",
     ["React", "TypeScript", "Supabase"]),
    ("Pokedex Full Stack", "2026",
     "Sistema full stack integrado à PokéAPI para consulta e gerenciamento de informações de Pokémon.",
     "Full stack system integrated with PokéAPI to search and manage Pokémon data.",
     ["React", "PHP", "MySQL"]),
]

PROJECT_TITLES_EN = {"Nexo — Controle Financeiro": "Nexo — Finance Tracker"}

EXPERIENCE = [
    ("Estagiário de Desenvolvimento", "Development Intern", "Agência VoêFly",
     "2026 — Presente", "2026 — Present", "Estágio · Presencial", "Internship · On-site",
     ["Desenvolvimento de interfaces de alta performance para clientes de e-commerce e fintech, com foco em usabilidade e consistência visual.",
      "Construção de telas responsivas e colaboração em fluxos de entrega web, integrando tecnologias modernas ao time."],
     ["Built high-performance interfaces for e-commerce and fintech clients, focusing on usability and visual consistency.",
      "Delivered responsive screens and collaborated on web delivery workflows, integrating modern technologies into the team."]),
    ("Jovem Aprendiz e Líder de Grupo", "Young Apprentice & Group Leader", "SENAI Avak Bedouian",
     "2023 — 2024", "2023 — 2024", "Jovem Aprendiz · Presencial", "Apprenticeship · On-site",
     ["Liderança de grupo em projetos de aprendizado técnico, organizando atividades e a divisão de tarefas entre integrantes.",
      "Construção de base técnica sólida em programação, lógica, sistemas e boas práticas de desenvolvimento."],
     ["Led a group on technical learning projects, organizing activities and task division among team members.",
      "Built a solid technical foundation in programming, logic, systems and development best practices."]),
]

EDUCATION = [
    ("Tecnologia em Análise e Desenvolvimento de Sistemas",
     "Systems Analysis and Development Technology", "Unisalesiano · 2025—2027"),
    ("Técnico em Análise e Desenvolvimento de Sistemas",
     "Technical Course in Systems Analysis and Development", "SENAI Avak Bedouian · 2023—2024"),
]

SUMMARY_PT = ("Desenvolvedor Full Stack em início de carreira, com experiência prática em React, TypeScript, "
              "PHP e Python — do frontend à modelagem de banco de dados e integração de APIs. Foco em código "
              "limpo, performance e boa experiência de uso, com histórico de liderança de equipe e entrega de "
              "projetos reais em ambientes colaborativos.")
SUMMARY_EN = ("Full Stack developer at the beginning of my career, with hands-on experience in React, TypeScript, "
              "PHP and Python — from frontend to database design and API integration. Focused on clean code, "
              "performance and strong user experience, with a track record of team leadership and delivering real "
              "projects in collaborative environments.")

L = {
    "pt": dict(role="DESENVOLVEDOR FULL STACK", contact="CONTATO", skills="HABILIDADES",
               langs="IDIOMAS", edu="FORMAÇÃO", summary="RESUMO", exp="EXPERIÊNCIA PROFISSIONAL",
               proj="PROJETOS EM DESTAQUE", certs="CERTIFICAÇÕES",
               local="LOCAL", email="EMAIL", phone="TELEFONE", github="GITHUB", linkedin="LINKEDIN",
               db="Banco de Dados", tools="Ferramentas & IA",
               l1="Português", l1v="Nativo", l2="Inglês", l2v="Intermediário"),
    "en": dict(role="FULL STACK DEVELOPER", contact="CONTACT", skills="SKILLS",
               langs="LANGUAGES", edu="EDUCATION", summary="SUMMARY", exp="PROFESSIONAL EXPERIENCE",
               proj="FEATURED PROJECTS", certs="CERTIFICATIONS",
               local="LOCATION", email="EMAIL", phone="PHONE", github="GITHUB", linkedin="LINKEDIN",
               db="Database", tools="Tools & AI",
               l1="Portuguese", l1v="Native", l2="English", l2v="Intermediate"),
}

# ---------------------------------------------------------------------- style
CSS = """
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4;margin:0}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Inter',sans-serif;font-size:9.1pt;color:#1c1c22;background:#fff}
.page{display:flex;width:210mm;min-height:297mm}
aside{width:33.5%;background:#12121c;color:#fff;padding:26px 22px 30px}
main{width:66.5%;padding:26px 26px 30px 24px}
.photo{width:104px;height:104px;border-radius:50%;margin:0 auto 16px;padding:3px;
  background:linear-gradient(140deg,#8B5CF6,#EC4899 55%,#F59E0B)}
.photo img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}
.nm{font-size:17.5pt;font-weight:700;line-height:1.14;text-align:center;letter-spacing:-.3px}
.rolebox{margin:9px auto 22px;border-top:1.4px solid #8B5CF6;border-bottom:1.4px solid #8B5CF6;
  padding:4px 0;text-align:center;font-size:7.4pt;font-weight:600;letter-spacing:1.3px}
.sh{display:flex;align-items:center;gap:7px;margin:0 0 11px;font-size:7.8pt;font-weight:700;
  letter-spacing:1.5px;color:#A78BFA}
.sh i{width:8px;height:8px;background:#8B5CF6;border-radius:2px;display:block}
aside .blk{margin-bottom:20px}
.ck{font-size:6.3pt;letter-spacing:.9px;color:#8b8b9e;font-weight:600;margin-bottom:1px}
.cv{font-size:8.4pt;color:#e9e9f2;margin-bottom:9px;word-break:break-word;line-height:1.35}
.cat{font-size:7.4pt;color:#9c9cb2;margin:9px 0 5px}
.chips{display:flex;flex-wrap:wrap;gap:4px}
.chip{font-size:7.4pt;background:#22223a;border:.6px solid #33334f;color:#e2e2ee;
  padding:2.5px 7px;border-radius:20px;white-space:nowrap}
.lang{display:flex;justify-content:space-between;font-size:8.4pt;padding:3px 0;
  border-bottom:.6px solid #ffffff14}
.lang b{color:#A78BFA;font-weight:600}
.ed{margin-bottom:10px}
.ed b{display:block;font-size:8.4pt;font-weight:600;line-height:1.3}
.ed span{font-size:7.4pt;color:#9c9cb2}
.mh{display:flex;align-items:center;gap:8px;margin:0 0 9px;font-size:8.2pt;font-weight:700;
  letter-spacing:1.6px;color:#7C3AED}
.mh i{width:15px;height:2.6px;background:#7C3AED;border-radius:2px;display:block}
.sec{margin-bottom:19px}
.sum{line-height:1.52;color:#2c2c34}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
.ttl{font-size:9.9pt;font-weight:700;color:#111118}
.ttl em{font-style:normal;color:#7C3AED;font-weight:600}
.dt{font-size:8pt;color:#8a8a97;white-space:nowrap}
.meta{font-style:italic;font-size:8pt;color:#8a8a97;margin:1px 0 5px}
ul{list-style:none;margin-bottom:11px}
li{position:relative;padding-left:11px;line-height:1.47;margin-bottom:3px;color:#33333d}
li:before{content:"";position:absolute;left:0;top:5.5px;width:4px;height:4px;border-radius:50%;
  background:#8B5CF6}
.pj{margin-bottom:11px}
.pd{line-height:1.47;color:#33333d;margin:1px 0 5px}
.tags{display:flex;flex-wrap:wrap;gap:4px}
.tag{font-size:7.4pt;background:#f1ecfe;color:#6D28D9;padding:2.5px 7px;border-radius:4px}
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:9px 20px}
.ci{display:flex;gap:7px}
.ci i{width:7px;height:7px;border-radius:50%;flex:none;margin-top:3.5px;display:block}
.cn{font-size:8.7pt;font-weight:600;color:#111118;line-height:1.28}
.cm{font-size:7.3pt;color:#8a8a97;margin-top:1px}
.cd{font-size:7.5pt;color:#4a4a56;line-height:1.4;margin-top:2px}
"""


def chips(items):
    return '<div class="chips">' + "".join(f'<span class="chip">{c}</span>' for c in items) + "</div>"


def build(lang):
    t = L[lang]
    en = lang == "en"
    side = [
        f'<div class="photo"><img src="data:image/jpeg;base64,{photo_b64}"></div>',
        '<div class="nm">Nicolas Pichiteli<br>dos Santos</div>',
        f'<div class="rolebox">{t["role"]}</div>',
        f'<div class="blk"><div class="sh"><i></i>{t["contact"]}</div>',
        f'<div class="ck">{t["local"]}</div><div class="cv">'
        f'{CONTACT["local_en"] if en else CONTACT["local"]}</div>',
        f'<div class="ck">{t["email"]}</div><div class="cv">{CONTACT["email"]}</div>',
        f'<div class="ck">{t["phone"]}</div><div class="cv">{CONTACT["phone"]}</div>',
        f'<div class="ck">{t["github"]}</div><div class="cv">{CONTACT["github"]}</div>',
        f'<div class="ck">{t["linkedin"]}</div><div class="cv">{CONTACT["linkedin"]}</div></div>',
        f'<div class="blk"><div class="sh"><i></i>{t["skills"]}</div>',
    ]
    for name, items in SKILLS:
        label = t["db"] if name == "__DB__" else t["tools"] if name == "__TOOLS__" else name
        side.append(f'<div class="cat">{label}</div>{chips(items)}')
    side.append("</div>")
    side.append(f'<div class="blk"><div class="sh"><i></i>{t["langs"]}</div>'
                f'<div class="lang"><span>{t["l1"]}</span><b>{t["l1v"]}</b></div>'
                f'<div class="lang"><span>{t["l2"]}</span><b>{t["l2v"]}</b></div></div>')
    side.append(f'<div class="blk"><div class="sh"><i></i>{t["edu"]}</div>')
    for pt, eng, sub in EDUCATION:
        side.append(f'<div class="ed"><b>{eng if en else pt}</b><span>{sub}</span></div>')
    side.append("</div>")

    main = [f'<div class="sec"><div class="mh"><i></i>{t["summary"]}</div>'
            f'<div class="sum">{SUMMARY_EN if en else SUMMARY_PT}</div></div>',
            f'<div class="sec"><div class="mh"><i></i>{t["exp"]}</div>']
    for rpt, ren, comp, dpt, den, mpt, men, bpt, ben in EXPERIENCE:
        main.append(f'<div class="row"><div class="ttl">{ren if en else rpt} <em>· {comp}</em></div>'
                    f'<div class="dt">{den if en else dpt}</div></div>'
                    f'<div class="meta">{men if en else mpt}</div><ul>'
                    + "".join(f"<li>{b}</li>" for b in (ben if en else bpt)) + "</ul>")
    main.append("</div>")

    main.append(f'<div class="sec"><div class="mh"><i></i>{t["proj"]}</div>')
    for title, year, dpt, den, tags in PROJECTS:
        if en:
            title = PROJECT_TITLES_EN.get(title, title)
        main.append(f'<div class="pj"><div class="row"><div class="ttl">{title}</div>'
                    f'<div class="dt">{year}</div></div><div class="pd">{den if en else dpt}</div>'
                    '<div class="tags">' + "".join(f'<span class="tag">{g}</span>' for g in tags)
                    + "</div></div>")
    main.append("</div>")

    main.append(f'<div class="sec"><div class="mh"><i></i>{t["certs"]}</div><div class="cgrid">')
    for color, npt, nen, meta, dpt, den in CERTS:
        main.append(f'<div class="ci"><i style="background:{color}"></i><div>'
                    f'<div class="cn">{nen if en else npt}</div><div class="cm">{meta}</div>'
                    f'<div class="cd">{den if en else dpt}</div></div></div>')
    main.append("</div></div>")

    html = (f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8">'
            f"<style>{CSS}</style></head><body><div class=\"page\">"
            f'<aside>{"".join(side)}</aside><main>{"".join(main)}</main></div></body></html>')
    (OUT / f"cv-{lang}.html").write_text(html, encoding="utf-8")
    print("wrote", OUT / f"cv-{lang}.html")


build("pt")
build("en")
