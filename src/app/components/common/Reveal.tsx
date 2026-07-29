import { motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* Entrada por scroll, confiável.

   Por que não usar `whileInView` direto: o padrão anterior aninhava `whileInView` dentro
   de `whileInView` (um observer por elemento). Com scroll instantâneo — que é o caso do
   MENU, o caminho principal de navegação — os observers pai e filho disparam no mesmo
   frame, e com `once: true` o filho era marcado como resolvido sem nunca animar. Medido:
   27 de 169 elementos ficavam presos em opacity 0 na seção de certificados.

   Aqui há UM observer por bloco e os filhos entram por `variants` herdadas (stagger), que
   é o mecanismo do Motion para isso. Mais o fallback que faltava: se o bloco já está na
   viewport quando monta, revela na hora em vez de esperar um cruzamento que não vem. */

const EASE = [0.16, 1, 0.3, 1] as const;

/* `hidden` precisa declarar as MESMAS chaves que os filhos usam, senão o Motion não tem
   de onde interpolar e alguns filhos ficam presos no estado inicial — foi o que fez o
   label do header aparecer e o <h2> irmão não. */
export const revealParent: Variants = {
  hidden: { opacity: 1 },
  shown: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};

/** filho de um Reveal: sobe e materializa junto do grupo */
export const revealChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/** variação lateral, para trilhos e listas horizontais */
export const revealChildX: Variants = {
  hidden: { opacity: 0, x: -14 },
  shown: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
};

export function Reveal({
  children,
  className,
  delay = 0,
  amount = 0.15,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** fração do bloco que precisa aparecer para disparar */
  amount?: number;
  as?: "div" | "section" | "ul" | "ol" | "li";
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;

    /* fallback: já visível no mount (deep link, reload no meio da página, menu) */
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      entries => {
        if (entries.some(e => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: amount },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown, amount]);

  const MotionTag = motion[Tag] as typeof motion.div;

  return (
    /* Sem prop `transition` aqui: ela sobrescreveria o `staggerChildren` declarado na
       variant `shown` e a propagação para os filhos parava de funcionar. O atraso do
       bloco entra pelo `delayChildren` da própria variant. */
    <MotionTag
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
      variants={delay ? { hidden: { opacity: 1 }, shown: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: delay } } } : revealParent}
      initial="hidden"
      animate={shown ? "shown" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}
