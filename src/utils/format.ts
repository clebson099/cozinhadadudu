import { UNIT_LABELS, type Unit } from "@/types";

export const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

// Pretty quantity: trims trailing zeros, pt-BR decimals.
export const formatQty = (q: number, unit: Unit) => {
  const n = Math.round(q * 1000) / 1000;
  const str = n.toLocaleString("pt-BR", { maximumFractionDigits: 3 });
  return `${str} ${UNIT_LABELS[unit]}`;
};

export const slugify = () => Math.random().toString(36).slice(2, 8);
