import { Link } from "react-router-dom";
import { ClipboardList, Users, UtensilsCrossed, CheckCircle2, ChevronRight } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { formatCurrency, formatDate } from "@/utils/format";
import { totalServings } from "@/utils/calculations";

export default function Orders() {
  const { orders } = useData();

  return (
    <div>
      <PageHeader title="Pedidos" subtitle="Todos os pedidos enviados pelos seus clientes." />

      {orders.length === 0 ? (
        <EmptyState icon={ClipboardList} title="Nenhum pedido ainda"
          subtitle="Compartilhe um link de cardápio para começar a receber pedidos." />
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} to={`/pedidos/${o.id}`}
              className="card p-5 flex items-center gap-4 hover:shadow-card transition animate-fade-in">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg text-graphite truncate">{o.customerName}</h3>
                  <span className="chip bg-sage/20 text-sage-dark"><CheckCircle2 size={12}/> {o.status}</span>
                </div>
                <p className="text-sm text-graphite-light/80">{o.customerPhone} · {formatDate(o.createdAt)}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-graphite-light">
                  <span className="flex items-center gap-1"><Users size={13}/> {totalServings(o.dishes)} pessoas</span>
                  <span className="flex items-center gap-1"><UtensilsCrossed size={13}/> {o.dishes.length} pratos</span>
                  <span className="font-semibold text-graphite">{formatCurrency(o.laborCost)}</span>
                </div>
              </div>
              <ChevronRight className="text-graphite-light/50 shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
