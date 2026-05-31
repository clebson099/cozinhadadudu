import { Link } from "react-router-dom";
import { UtensilsCrossed, ClipboardList, CheckCircle2, Link2, Plus, ArrowRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import StatCard from "@/components/StatCard";
import { mockUser } from "@/mock/data";
import { formatCurrency } from "@/utils/format";

export default function Dashboard() {
  const { dishes, links, orders } = useData();
  const activeLinks = links.filter((l) => new Date(l.expiresAt).getTime() > Date.now());
  const finalized = orders.filter((o) => o.status === "FINALIZADO");
  const revenue = orders.reduce((s, o) => s + o.laborCost, 0);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-graphite-light/80">Olá, {mockUser.name} 👋</p>
        <h1 className="font-display text-3xl font-semibold text-graphite">Seu painel</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={UtensilsCrossed} label="Pratos cadastrados" value={dishes.length} tone="sage" />
        <StatCard icon={ClipboardList} label="Pedidos recebidos" value={orders.length} tone="peach" />
        <StatCard icon={CheckCircle2} label="Finalizados" value={finalized.length} tone="graphite" />
        <StatCard icon={Link2} label="Links ativos" value={activeLinks.length} tone="sage" />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-6">
        <div className="card p-6">
          <h2 className="font-display text-xl text-graphite mb-1">Atalhos rápidos</h2>
          <p className="text-sm text-graphite-light/80 mb-4">Faça mais com menos cliques.</p>
          <div className="flex flex-col gap-2.5">
            <Link to="/pratos/novo" className="btn-accent w-full"><Plus size={18}/> Cadastrar prato</Link>
            <Link to="/links" className="btn-sage w-full"><Link2 size={18}/> Gerar link de cardápio</Link>
            <Link to="/pedidos" className="btn-ghost w-full justify-between">Ver pedidos <ArrowRight size={18}/></Link>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-display text-xl text-graphite mb-1">Resumo financeiro</h2>
          <p className="text-sm text-graphite-light/80 mb-4">Mão de obra acumulada nos pedidos.</p>
          <p className="text-4xl font-bold text-sage-dark">{formatCurrency(revenue)}</p>
          <div className="mt-4 space-y-2">
            {orders.slice(0, 3).map((o) => (
              <Link key={o.id} to={`/pedidos/${o.id}`} className="flex justify-between items-center text-sm py-2 px-3 rounded-xl hover:bg-cream-dark/40 transition">
                <span className="font-medium text-graphite">{o.customerName}</span>
                <span className="text-graphite-light/80">{formatCurrency(o.laborCost)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
