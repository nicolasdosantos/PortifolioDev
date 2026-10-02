import { useCallback, useState } from "react";
import type { PendingLink } from "../types";

/** Manages the "confirm before opening an external link" flow used by the Contact section.
    As funções são estáveis (useCallback): o diálogo usa `cancel` como dependência de efeito,
    e uma função nova a cada render faria o foco pular de volta para o gatilho. */
export function useConfirmNavigate() {
  const [pending, setPending] = useState<PendingLink | null>(null);

  const request = useCallback((link: PendingLink) => setPending(link), []);
  const cancel = useCallback(() => setPending(null), []);
  const confirm = useCallback(() => {
    if (pending) window.open(pending.href, "_blank", "noopener,noreferrer");
    setPending(null);
  }, [pending]);

  return { pending, request, cancel, confirm };
}
