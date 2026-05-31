import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export default function EmptyState({ icon: Icon, title, subtitle, action }: {
  icon: LucideIcon; title: string; subtitle?: string; action?: ReactNode;
}) {
  return (
    <div className="card p-10 text-center flex flex-col items-center animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-sage/15 text-sage-dark flex items-center justify-center">
        <Icon size={30} />
      </div>
      <h3 className="mt-4 font-display text-xl text-graphite">{title}</h3>
      {subtitle && <p className="mt-1 text-graphite-light/80 max-w-sm">{subtitle}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
