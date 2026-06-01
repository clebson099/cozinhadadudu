declare module "lucide-react" {
  import type { FC, SVGProps } from "react";
  export interface LucideProps extends SVGProps<SVGSVGElement> { size?: number | string; }
  export type LucideIcon = FC<LucideProps>;
  export const icons: Record<string, LucideIcon>;
  const content: Record<string, LucideIcon>;
  export default content;
  export const LayoutDashboard: LucideIcon;
  export const UtensilsCrossed: LucideIcon;
  export const Link2: LucideIcon;
  export const ClipboardList: LucideIcon;
  export const Plus: LucideIcon;
  export const Minus: LucideIcon;
  export const Trash2: LucideIcon;
  export const Pencil: LucideIcon;
  export const Save: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Users: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const Check: LucideIcon;
  export const Copy: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Clock: LucideIcon;
  export const FileDown: LucideIcon;
  export const ShoppingBasket: LucideIcon;
  export const Send: LucideIcon;
  export const PartyPopper: LucideIcon;
  export const CalendarX2: LucideIcon;
}
