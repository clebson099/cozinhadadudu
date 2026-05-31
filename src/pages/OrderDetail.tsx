import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileDown, Plus, Trash2, Save, Users, CheckCircle2 } from "lucide-react";
import { useData } from "@/contexts/DataContext";
import { UNIT_LABELS, type ShoppingItem, type Unit } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import { totalServings } from "@/utils/calculations";
import { generateOrderPdf } from "@/utils/pdf";

const units = Object.keys(UNIT_LABELS) as Unit[];

export default function OrderDetail() {
  const { id } = useParams();
  const { orders, updateOrder } = useData();
  const navigate = useNavigate();
  const order = orders.find((o) => o.id === id);

  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [labor, setLabor] = useState(0);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (order) { setItems(order.shoppingList); setLabor(order.laborCost); }
  }, [order]);

  const total = useMemo(() => labor, [labor]);

  if (!order) return (
    <div className="card p-8 text-center">
      <p className="text-graphite-light">Pedido não encontrado.</p>
      <button onClick={() => navigate("/pedidos")} className="btn-ghost mt-4">Voltar</button>
    </div>
  );

  const setItem = (idx: number, patch: Partial<ShoppingItem>) => {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))); setDirty(true);
  };
  const removeItem = (idx: number) => { setItems((prev) => prev.filter((_, i) => i !== idx)); setDirty(true); };
  const addItem = () => { setItems((prev) => [...prev, { id: crypto.randomUUID(), name: "", quantity: 1, unit: "kg", manual: true }]); setDirty(true); };

  const save = async () => { await updateOrder(order.id, { shoppingList: items, laborCost: labor }); setDirty(false); };
  const exportPdf = () => generateOrderPdf({ ...order, shoppingList: items, laborCost: labor });

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 text-sm"><ArrowLeft size={16}/> Voltar</button>

      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl text-graphite">{order.customerName}</h1>
            <span className="chip bg-sage/20 text-sage-dark"><CheckCircle2 size={12}/> {order.status}</span>
          </div>
          <p className="text-graphite-light/80">{order.customerPhone} · {formatDate(order.createdAt)}</p>
        </div>
        <button onClick={exportPdf} className="btn-primary"><FileDown size={18}/> PDF</button>
      </div>

      {order.notes && (
        <div className="card p-4 mb-4 bg-peach/10 border-peach/30">
          <p className="text-sm"><span className="font-semibold">Observações:</span> {order.notes}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <h2 className="font-display text-xl text-graphite mb-3">Pratos escolhidos</h2>
          <div className="space-y-2">
            {order.dishes.map((d) => (
              <div key={d.dishId} className="flex justify-between items-center py-2 px-3 rounded-xl bg-cream-dark/30">
                <span className="font-medium text-graphite">{d.dishName}</span>
                <span className="flex items-center gap-1 text-sm text-graphite-light"><Users size={14}/> {d.servings}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-graphite-light mt-3">Total: <strong>{totalServings(order.dishes)} pessoas</strong></p>
        </div>

        <div className="card p-5">
          <h2 className="font-display text-xl text-graphite mb-1">Mão de obra & total</h2>
          <label className="label mt-2">Valor da mão de obra (R$)</label>
          <input type="number" step="any" className="input" value={labor}
            onChange={(e) => { setLabor(Number(e.target.value)); setDirty(true); }} />
          <div className="mt-4 pt-4 border-t border-cream-dark flex justify-between items-center">
            <span className="text-graphite-light">Valor total</span>
            <span className="text-2xl font-bold text-sage-dark">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="card p-5 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl text-graphite">Lista de compras</h2>
          <button onClick={addItem} className="btn-ghost text-sm"><Plus size={16}/> Item</button>
        </div>
        <div className="space-y-2">
          {items.map((it, i) => (
            <div key={it.id} className="flex gap-2 items-center">
              <input className="input flex-1" value={it.name} placeholder="Ingrediente"
                onChange={(e) => setItem(i, { name: e.target.value })} />
              <input type="number" step="any" className="input w-24" value={it.quantity}
                onChange={(e) => setItem(i, { quantity: Number(e.target.value) })} />
              <select className="input w-32" value={it.unit} onChange={(e) => setItem(i, { unit: e.target.value as Unit })}>
                {units.map((u) => <option key={u} value={u}>{UNIT_LABELS[u]}</option>)}
              </select>
              <button onClick={() => removeItem(i)} className="btn bg-peach/20 text-peach-dark p-3 rounded-2xl"><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={save} disabled={!dirty} className="btn-sage flex-1"><Save size={18}/> {dirty ? "Salvar alterações" : "Salvo"}</button>
          <button onClick={exportPdf} className="btn-primary flex-1"><FileDown size={18}/> Gerar PDF</button>
        </div>
      </div>
    </div>
  );
}
