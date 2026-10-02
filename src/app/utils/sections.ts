/** Rola até a seção e deixa o endereço com a âncora (`/#projetos`), para o link poder ser
    copiado e compartilhado. `replaceState` em vez de `pushState`: cada clique no menu não
    vira uma entrada no histórico, então o botão Voltar continua saindo do site. */
export function goToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  const url = id === "home" ? window.location.pathname + window.location.search : `#${id}`;
  history.replaceState(null, "", url);
}

/** Âncora da URL atual (`#projetos` → `"projetos"`), ou null se não houver. */
export function currentHashId() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return id || null;
}
