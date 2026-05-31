import type { LucideIcon } from "lucide-react";

export default function StatCard({ icon: Icon, label, value, tone = "sage" }: {
  icon: LucideIcon; label: string; value: string | number;
  tone?: "sage" | "peach" | "graphite";
}) {
  const tones = {
    sage: "bg-sage/15 text-sage-dark",
    peach: "bg-peach/20 text-peach-dark",
    graphite: "bg-graphite/10 text-graphite",
  };
  return (
    <div className="card p-5 animate-fade-in">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${tones[tone]}`}>
        <Icon size={22} />
      </div>
      <p className="mt-3 text-3xl font-bold text-graphite">{value}</p>
      <p className="text-sm text-graphite-light/80">{label}</p>
    </div>
  );
}
