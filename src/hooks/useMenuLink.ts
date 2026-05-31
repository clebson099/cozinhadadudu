import { useEffect, useState } from "react";
import type { MenuLink } from "@/types";
import { menuLinkService } from "@/services";

export function useMenuLink(slug?: string) {
  const [link, setLink] = useState<MenuLink | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    menuLinkService.getBySlug(slug).then((l) => { setLink(l); setLoading(false); });
  }, [slug]);

  const expired = link ? new Date(link.expiresAt).getTime() < Date.now() : false;
  return { link, loading, expired };
}
