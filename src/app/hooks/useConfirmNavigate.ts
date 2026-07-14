import { useState } from "react";
import type { PendingLink } from "../types";

/** Manages the "confirm before opening an external link" flow shared by Contact, Skills and FavoriteTools. */
export function useConfirmNavigate() {
  const [pending, setPending] = useState<PendingLink | null>(null);

  const request = (link: PendingLink) => setPending(link);
  const cancel = () => setPending(null);
  const confirm = () => {
    if (pending) window.open(pending.href, "_blank", "noopener,noreferrer");
    setPending(null);
  };

  return { pending, request, cancel, confirm };
}
