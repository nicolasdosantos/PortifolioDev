# -*- coding: utf-8 -*-
"""Currículo profissional (PT-BR), layout simples de duas colunas — sem foto,
sem elementos "Canva". Baseado no estilo do cv-linkedin, porém com resumo e
estágio mais descritivos, formação acima da experiência profissional,
certificações na coluna principal e habilidades/idiomas/projetos na coluna
lateral, com o B4 Charge como projeto de destaque principal."""
import pathlib

OUT = pathlib.Path(__file__).parent

# dados compartilhados com os demais currículos (copiados aqui para não depender
# do caminho de foto hard-coded em gen_cv.py)
CONTACT = dict(
    local="Birigui - SP, Brasil",
    email="nicolaspichiteli245@gmail.com",
    phone="+55 (18) 99614-8839",
    github="github.com/nicolasdosantos",
    linkedin="linkedin.com/in/nicolas-pichiteli-dos-santos-942a0b269",
)

SKILLS = [
    ("Frontend", ["React", "React Native", "TypeScript", "JavaScript", "Tailwind CSS"]),
    ("Backend", ["Node.js", "PHP", "Laravel", "Python", "Flask", "Java"]),
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

EDUCATION = [
    ("Tecnologia em Análise e Desenvolvimento de Sistemas",
     "Systems Analysis and Development Technology", "Unisalesiano · 2025—2027"),
    ("Técnico em Análise e Desenvolvimento de Sistemas",
     "Technical Course in Systems Analysis and Development", "SENAI Avak Bedouian · 2023—2024"),
]

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4;margin:0}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Inter',sans-serif;font-size:8pt;color:#1c1c22;background:#fff}
.page{width:210mm;min-height:297mm;padding:12mm 13mm 10mm}
header{display:flex;justify-content:space-between;align-items:flex-end;
  border-bottom:1.5px solid #7C3AED;padding-bottom:7px;margin-bottom:11px}
.nm{font-size:15.4pt;font-weight:700;letter-spacing:-.3px;line-height:1.1}
.role{font-size:7.6pt;font-weight:600;letter-spacing:1.8px;color:#7C3AED;margin-top:3px}
.ct{text-align:right;font-size:7.4pt;color:#55555f;line-height:1.5}
h2{font-size:7.5pt;font-weight:700;letter-spacing:1.4px;color:#7C3AED;margin:0 0 5px;
  padding-bottom:2px;border-bottom:.7px solid #e6e1f5}
.sec{margin-bottom:10px}
.sum{line-height:1.42;color:#2c2c34}
.cols{display:flex;gap:16px}
.left{width:61%}
.right{width:39%}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.ttl{font-size:8.7pt;font-weight:700;color:#111118}
.ttl em{font-style:normal;color:#7C3AED;font-weight:600}
.dt{font-size:7.1pt;color:#8a8a97;white-space:nowrap}
.meta{font-style:italic;font-size:7.1pt;color:#8a8a97;margin:1px 0 3px}
ul{list-style:none;margin-bottom:6px}
li{position:relative;padding-left:10px;line-height:1.36;margin-bottom:1.5px;color:#33333d}
li:before{content:"";position:absolute;left:0;top:4.8px;width:3.5px;height:3.5px;border-radius:50%;
  background:#8B5CF6}
/* educação */
.ed{margin-bottom:7px}
.ed .row .ttl{font-size:8.5pt}
.ed .meta{margin:1px 0 2px}
.ed p{line-height:1.36;color:#33333d}
/* certificações — grid 2 colunas na coluna principal */
.cgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px}
.ci{display:flex;gap:5px}
.ci i{width:6px;height:6px;border-radius:50%;flex:none;margin-top:3.2px;display:block}
.cn{font-size:7.8pt;font-weight:600;color:#111118;line-height:1.22}
.cm{font-size:6.6pt;color:#8a8a97;margin-top:1px}
.cd{font-size:6.7pt;color:#4a4a56;line-height:1.3;margin-top:1px}
/* coluna lateral */
.cat{font-size:6.6pt;font-weight:700;letter-spacing:.8px;color:#8a8a97;margin:6px 0 3px}
.cat:first-child{margin-top:0}
.chips{display:flex;flex-wrap:wrap;gap:3px}
.chip{font-size:6.7pt;background:#f1ecfe;color:#6D28D9;padding:1.5px 5px;border-radius:4px}
.lang{display:flex;justify-content:space-between;font-size:7.9pt;padding:2px 0;
  border-bottom:.6px solid #eeecf6}
.lang b{color:#7C3AED;font-weight:600}
/* projetos */
.pj{margin-bottom:7px;padding-left:8px;border-left:2px solid #e6e1f5}
.pj.feat{border-left:2.2px solid #7C3AED;background:#faf8ff;padding:6px 7px 6px 8px;
  border-radius:0 4px 4px 0;margin-bottom:8px}
.pj .row .ttl{font-size:8.5pt}
.pj.feat .ttl{font-size:8.7pt}
.tag-star{font-size:6.2pt;font-weight:700;letter-spacing:.6px;color:#7C3AED;
  background:#efe8fc;padding:1px 4px;border-radius:3px;margin-left:4px;vertical-align:1px}
.pd{line-height:1.36;color:#33333d;margin:2px 0 4px}
.tags{display:flex;flex-wrap:wrap;gap:3px}
.tag{font-size:6.6pt;background:#f1ecfe;color:#6D28D9;padding:1.5px 5px;border-radius:4px}
"""

CAT = {"__DB__": "BANCO DE DADOS", "__TOOLS__": "FERRAMENTAS & IA"}

SUMMARY = (
    "Desenvolvedor Full Stack em início de carreira, cursando Análise e Desenvolvimento de Sistemas "
    "e atuando como estagiário de desenvolvimento na Agência VoêFly. Constrói produtos completos, do "
    "modelo de dados à interface: já levou para produção um SaaS financeiro multiempresa (B4 Charge), "
    "hoje utilizado por empresas reais para controlar vendas parceladas, cobranças e caixa, com "
    "isolamento de dados por empresa garantido no backend. Experiência prática com React, TypeScript, "
    "Node.js, PHP, Laravel e Python, incluindo modelagem de banco de dados (MySQL/PostgreSQL) e "
    "integração de APIs. Prioriza código limpo, segurança e boa experiência de uso, com histórico de "
    "liderança de equipe e de aprendizado rápido aplicado a entregas reais."
)

EDU_DESC = {
    "Tecnologia em Análise e Desenvolvimento de Sistemas":
        "Formação superior com foco em engenharia de software, banco de dados, arquitetura de "
        "sistemas e gestão de projetos de TI.",
    "Técnico em Análise e Desenvolvimento de Sistemas":
        "Base técnica em lógica de programação, estruturas de dados, orientação a objetos e "
        "modelagem de bancos relacionais.",
}
EDU_STATUS = {
    "Tecnologia em Análise e Desenvolvimento de Sistemas": "Em andamento",
    "Técnico em Análise e Desenvolvimento de Sistemas": "Concluído",
}

EXPERIENCE = [
    ("Estagiário de Desenvolvimento", "Agência VoêFly", "2026 — Presente", "Estágio · Presencial",
     ["Desenvolve e mantém o site institucional multimarcas do grupo (ViajaFlux, VoêFly e eventos), "
      "com foco em consistência visual e responsividade entre as marcas.",
      "Colabora na construção do portal de participantes do Viajaflux Summit, sistema com múltiplos "
      "perfis de acesso — participante, patrocinador, organização e prestador de serviço — incluindo "
      "dashboards, gestão de convidados e conteúdo do evento.",
      "Atua em fluxos de entrega web ponta a ponta, estruturando telas em React e colaborando com o "
      "time em stacks adicionais como PHP/Laravel conforme a necessidade do projeto.",
      "Mantém foco em usabilidade, performance e consistência de design em produtos usados por "
      "clientes reais de diferentes segmentos."]),
    ("Jovem Aprendiz e Líder de Grupo", "SENAI Avak Bedouian", "2023 — 2024", "Jovem Aprendiz · Presencial",
     ["Liderou grupo em projetos de aprendizagem técnica, organizando atividades e a divisão de "
      "tarefas entre os integrantes.",
      "Construiu base técnica sólida em programação, lógica, sistemas e boas práticas de "
      "desenvolvimento, com foco em Python e bancos relacionais."]),
]

PROJECTS = [
    dict(title="B4 Charge — Sistema Financeiro Multiempresa", year="2025 — Presente", featured=True,
         desc=("SaaS de gestão financeira multiempresa em produção, usado por empresas reais para "
               "vendas parceladas, mensalidades, cobrança e caixa. Arquitetura multi-tenant com "
               "isolamento de dados no backend, geração automática de parcelas, recibo permanente e "
               "lançamento automático no caixa, além de um Painel Master para a plataforma."),
         tags=["React", "Node.js", "Express", "MySQL", "Multi-tenant"]),
    dict(title="Nexo — Controle Financeiro", year="2026", featured=False,
         desc=("Plataforma pessoal de controle financeiro com dashboards, metas de economia, "
               "orçamento por categoria e carteira de investimentos; dados isolados por usuário via "
               "Row Level Security no Supabase."),
         tags=["React", "TypeScript", "Supabase"]),
    dict(title="Obsidian Auto Detailing", year="2026", featured=False,
         desc=("Landing page premium para estética automotiva de alta performance, construída com "
               "TanStack Start, React 19 e Tailwind CSS v4."),
         tags=["React 19", "TypeScript", "TanStack Start", "Motion"]),
]

# ------------------------------------------------------------------ montagem
h = [f'<header><div><div class="nm">Nicolas Pichiteli dos Santos</div>'
     f'<div class="role">DESENVOLVEDOR FULL STACK</div></div>'
     f'<div class="ct">{CONTACT["local"]}<br>{CONTACT["email"]} · {CONTACT["phone"]}<br>'
     f'{CONTACT["linkedin"]}<br>{CONTACT["github"]}</div></header>']

h.append(f'<div class="sec"><h2>RESUMO</h2><div class="sum">{SUMMARY}</div></div>')

# --------------------------------------------------------------- coluna principal
left = ['<div class="sec"><h2>FORMAÇÃO</h2>']
for pt, _, sub in EDUCATION:
    status = EDU_STATUS.get(pt, "")
    desc = EDU_DESC.get(pt, "")
    left.append(f'<div class="ed"><div class="row"><div class="ttl">{pt}</div>'
                f'<div class="dt">{status}</div></div><div class="meta">{sub}</div>'
                f'<p>{desc}</p></div>')
left.append('</div><div class="sec"><h2>EXPERIÊNCIA PROFISSIONAL</h2>')
for role, comp, dt, mode, bullets in EXPERIENCE:
    left.append(f'<div class="row"><div class="ttl">{role} <em>— {comp}</em></div>'
                f'<div class="dt">{dt}</div></div><div class="meta">{mode}</div><ul>'
                + "".join(f"<li>{b}</li>" for b in bullets) + "</ul>")
left.append('</div><div class="sec"><h2>CERTIFICAÇÕES</h2><div class="cgrid">')
for color, npt, _, meta, dpt, _ in CERTS:
    left.append(f'<div class="ci"><i style="background:{color}"></i><div>'
                f'<div class="cn">{npt}</div><div class="cm">{meta}</div>'
                f'<div class="cd">{dpt}</div></div></div>')
left.append("</div></div>")

# --------------------------------------------------------------- coluna lateral
right = ['<div class="sec"><h2>HABILIDADES</h2>']
for name, items in SKILLS:
    label = CAT.get(name, name.upper())
    right.append(f'<div class="cat">{label}</div><div class="chips">'
                 + "".join(f'<span class="chip">{c}</span>' for c in items) + "</div>")
right.append('</div><div class="sec"><h2>IDIOMAS</h2>'
             '<div class="lang"><span>Português</span><b>Nativo</b></div>'
             '<div class="lang"><span>Inglês</span><b>Intermediário</b></div></div>')

right.append('<div class="sec"><h2>PROJETOS EM DESTAQUE</h2>')
for p in PROJECTS:
    cls = "pj feat" if p["featured"] else "pj"
    star = ' <span class="tag-star">DESTAQUE</span>' if p["featured"] else ""
    right.append(f'<div class="{cls}"><div class="row"><div class="ttl">{p["title"]}{star}</div>'
                f'<div class="dt">{p["year"]}</div></div><div class="pd">{p["desc"]}</div>'
                '<div class="tags">' + "".join(f'<span class="tag">{g}</span>' for g in p["tags"])
                + "</div></div>")
right.append("</div>")

html = ('<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">'
        f"<style>{CSS}</style></head><body><div class=\"page\">"
        + "".join(h)
        + f'<div class="cols"><div class="left">{"".join(left)}</div>'
          f'<div class="right">{"".join(right)}</div></div></div></body></html>')
(OUT / "cv-pro.html").write_text(html, encoding="utf-8")
print("wrote cv-pro.html")
