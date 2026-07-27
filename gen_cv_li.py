# -*- coding: utf-8 -*-
"""LinkedIn-style single-page CV: plain header + two columns, no photo."""
import pathlib
from gen_cv import CONTACT, SKILLS, CERTS, PROJECTS, EXPERIENCE, EDUCATION, SUMMARY_PT

OUT = pathlib.Path(__file__).parent

CSS = """
*{margin:0;padding:0;box-sizing:border-box}
@page{size:A4;margin:0}
html,body{-webkit-print-color-adjust:exact;print-color-adjust:exact}
body{font-family:'Inter',sans-serif;font-size:8.7pt;color:#1c1c22;background:#fff}
.page{width:210mm;min-height:297mm;padding:16mm 15mm 14mm}
header{display:flex;justify-content:space-between;align-items:flex-end;
  border-bottom:1.6px solid #7C3AED;padding-bottom:9px;margin-bottom:15px}
.nm{font-size:16pt;font-weight:700;letter-spacing:-.3px;line-height:1.1}
.role{font-size:8pt;font-weight:600;letter-spacing:2px;color:#7C3AED;margin-top:4px}
.ct{text-align:right;font-size:8pt;color:#55555f;line-height:1.6}
h2{font-size:8pt;font-weight:700;letter-spacing:1.6px;color:#7C3AED;margin:0 0 8px;
  padding-bottom:3px;border-bottom:.7px solid #e6e1f5}
.sec{margin-bottom:15px}
.sum{line-height:1.52;color:#2c2c34}
.cols{display:flex;gap:20px}
.left{width:62%}
.right{width:38%}
.row{display:flex;justify-content:space-between;align-items:baseline;gap:8px}
.ttl{font-size:9.4pt;font-weight:700;color:#111118}
.ttl em{font-style:normal;color:#7C3AED;font-weight:600}
.dt{font-size:7.7pt;color:#8a8a97;white-space:nowrap}
.meta{font-style:italic;font-size:7.7pt;color:#8a8a97;margin:1px 0 4px}
ul{list-style:none;margin-bottom:10px}
li{position:relative;padding-left:10px;line-height:1.45;margin-bottom:2px;color:#33333d}
li:before{content:"";position:absolute;left:0;top:5px;width:3.5px;height:3.5px;border-radius:50%;
  background:#8B5CF6}
.pj{margin-bottom:10px}
.pd{line-height:1.45;color:#33333d;margin:1px 0 4px}
.tags{display:flex;flex-wrap:wrap;gap:3px}
.tag{font-size:7.1pt;background:#f1ecfe;color:#6D28D9;padding:2px 6px;border-radius:4px}
.cat{font-size:7pt;font-weight:700;letter-spacing:.9px;color:#8a8a97;margin:8px 0 3px}
.cat:first-child{margin-top:0}
.sk{line-height:1.45;color:#33333d}
.lang{display:flex;justify-content:space-between;font-size:8.4pt;padding:2.5px 0;
  border-bottom:.6px solid #eeecf6}
.lang b{color:#7C3AED;font-weight:600}
.ed{margin-bottom:8px}
.ed b{display:block;font-size:8.4pt;font-weight:600;line-height:1.3;color:#111118}
.ed span{font-size:7.3pt;color:#8a8a97}
.ci{display:flex;gap:6px;margin-bottom:7px}
.ci i{width:6.5px;height:6.5px;border-radius:50%;flex:none;margin-top:3.2px;display:block}
.cn{font-size:8.4pt;font-weight:600;color:#111118;line-height:1.26}
.cm{font-size:7.1pt;color:#8a8a97;margin-top:1px}
.cd{font-size:7.2pt;color:#4a4a56;line-height:1.38;margin-top:1.5px}
"""

CAT = {"__DB__": "BANCO DE DADOS", "__TOOLS__": "FERRAMENTAS & IA"}

h = [f'<header><div><div class="nm">Nicolas Pichiteli dos Santos</div>'
     f'<div class="role">DESENVOLVEDOR FULL STACK</div></div>'
     f'<div class="ct">{CONTACT["local"]}<br>{CONTACT["email"]} · {CONTACT["phone"]}<br>'
     f'{CONTACT["linkedin"]}<br>{CONTACT["github"]}</div></header>']

h.append(f'<div class="sec"><h2>RESUMO</h2><div class="sum">{SUMMARY_PT}</div></div>')

left = ['<div class="sec"><h2>EXPERIÊNCIA PROFISSIONAL</h2>']
for rpt, _, comp, dpt, _, mpt, _, bpt, _ in EXPERIENCE:
    left.append(f'<div class="row"><div class="ttl">{rpt} <em>— {comp}</em></div>'
                f'<div class="dt">{dpt}</div></div><div class="meta">{mpt}</div><ul>'
                + "".join(f"<li>{b}</li>" for b in bpt) + "</ul>")
left.append('</div><div class="sec"><h2>PROJETOS EM DESTAQUE</h2>')
for title, year, dpt, _, tags in PROJECTS:
    left.append(f'<div class="pj"><div class="row"><div class="ttl">{title}</div>'
                f'<div class="dt">{year}</div></div><div class="pd">{dpt}</div>'
                '<div class="tags">' + "".join(f'<span class="tag">{g}</span>' for g in tags)
                + "</div></div>")
left.append("</div>")

right = ['<div class="sec"><h2>HABILIDADES</h2>']
for name, items in SKILLS:
    right.append(f'<div class="cat">{CAT.get(name, name.upper())}</div>'
                 f'<div class="sk">{", ".join(items)}</div>')
right.append('</div><div class="sec"><h2>IDIOMAS</h2>'
             '<div class="lang"><span>Português</span><b>Nativo</b></div>'
             '<div class="lang"><span>Inglês</span><b>Intermediário</b></div></div>')
right.append('<div class="sec"><h2>FORMAÇÃO</h2>')
for pt, _, sub in EDUCATION:
    right.append(f'<div class="ed"><b>{pt}</b><span>{sub}</span></div>')
right.append('</div><div class="sec"><h2>CERTIFICAÇÕES</h2>')
for color, npt, _, meta, dpt, _ in CERTS:
    right.append(f'<div class="ci"><i style="background:{color}"></i><div>'
                 f'<div class="cn">{npt}</div><div class="cm">{meta}</div>'
                 f'<div class="cd">{dpt}</div></div></div>')
right.append("</div>")

html = ('<!doctype html><html lang="pt"><head><meta charset="utf-8">'
        f"<style>{CSS}</style></head><body><div class=\"page\">"
        + "".join(h)
        + f'<div class="cols"><div class="left">{"".join(left)}</div>'
          f'<div class="right">{"".join(right)}</div></div></div></body></html>')
(OUT / "cv-linkedin.html").write_text(html, encoding="utf-8")
print("wrote cv-linkedin.html")
