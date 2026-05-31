import type { ReactNode } from "react";

export default function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-graphite">{title}</h1>
        {subtitle && <p className="text-graphite-light/80 mt-1 text-sm sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
