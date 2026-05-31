import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2, Users, UtensilsCrossed } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";

export default function Dishes() {
  const { dishes, removeDish } = useData();
  const navigate = useNavigate();

  return (
    <div>
      <PageHeader title="Pratos" subtitle="Cadastre seus pratos e ingredientes base."
        action={<Link to="/pratos/novo" className="btn-accent"><Plus size={18}/> Novo prato</Link>} />

      {dishes.length === 0 ? (
        <EmptyState icon={UtensilsCrossed} title="Nenhum prato ainda"
          subtitle="Cadastre seu primeiro prato para começar a montar cardápios."
          action={<Link to="/pratos/novo" className="btn-accent"><Plus size={18}/> Cadastrar prato</Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dishes.map((d) => (
            <div key={d.id} className="card overflow-hidden animate-fade-in group">
              <div className="h-40 bg-cream-dark/50 overflow-hidden">
                {d.photoUrl
                  ? <img src={d.photoUrl} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  : <div className="w-full h-full flex items-center justify-center text-sage"><UtensilsCrossed size={40}/></div>}
              </div>
              <div className="p-4">
                <h3 className="font-display text-lg text-graphite">{d.name}</h3>
                <p className="text-sm text-graphite-light/80 line-clamp-2 mt-0.5">{d.intro}</p>
                <div className="flex items-center gap-1.5 mt-3 text-xs text-graphite-light">
                  <Users size={14}/> Atende {d.baseServings} pessoas · {d.ingredients.length} ingredientes
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => navigate(`/pratos/${d.id}/editar`)} className="btn-ghost flex-1 text-sm"><Pencil size={15}/> Editar</button>
                  <button onClick={() => confirm(`Excluir "${d.name}"?`) && removeDish(d.id)}
                    className="btn flex-1 text-sm bg-peach/20 text-peach-dark px-4 py-2.5 hover:bg-peach/30"><Trash2 size={15}/> Excluir</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
