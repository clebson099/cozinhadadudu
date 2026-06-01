import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Users, ShoppingBasket, UtensilsCrossed, CalendarX2, PartyPopper, Send, Minus, Plus } from "lucide-react";
import { useMenuLink } from "@/hooks/useMenuLink";
import { useData } from "@/contexts/DataContext";
import { customerSchema, type CustomerFormValues } from "@/utils/schemas";
import { buildShoppingList } from "@/utils/calculations";

import type { Dish } from "@/types";
import Logo from "@/components/Logo";
import { mockUser } from "@/mock/data";

export default function PublicMenu() {
  const { slug } = useParams();
  const { link, loading, expired } = useMenuLink(slug);
  const { dishes, createOrder } = useData();
  const [selected, setSelected] = useState<Record<string, number>>({});
  const [step, setStep] = useState<"menu" | "form" | "done">("menu");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  const menuDishes = useMemo<Dish[]>(
    () => (link ? dishes.filter((d) => link.dishIds.includes(d.id)) : []),
    [link, dishes]
  );
  const dishesById = useMemo(() => Object.fromEntries(dishes.map((d) => [d.id, d])), [dishes]);
  const selectedList = Object.entries(selected).filter(([, n]) => n > 0);

  if (loading) return <CenterMsg><div className="animate-pulse text-graphite-light">Carregando cardápio…</div></CenterMsg>;

  if (!link || expired) return (
    <CenterMsg>
      <div className="card p-10 max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-peach/20 text-peach-dark flex items-center justify-center mx-auto"><CalendarX2 size={30}/></div>
        <h1 className="font-display text-2xl text-graphite mt-4">Cardápio indisponível</h1>
        <p className="text-graphite-light/80 mt-2">Este cardápio não está mais disponível.</p>
      </div>
    </CenterMsg>
  );

  const setQty = (id: string, n: number) => setSelected((p) => ({ ...p, [id]: Math.max(0, n) }));

  const onSubmit = async (v: CustomerFormValues) => {
    const orderDishes = selectedList.map(([dishId, servings]) => ({
      dishId, dishName: dishesById[dishId].name, servings,
    }));
    const shoppingList = buildShoppingList(orderDishes, dishesById);
    await createOrder({
      menuLinkId: link.id, customerName: v.name, customerPhone: v.phone,
      notes: v.notes, dishes: orderDishes, shoppingList, laborCost: 0,
    });
    setStep("done");
  };

  if (step === "done") return (
    <CenterMsg>
      <div className="card p-10 max-w-md text-center animate-pop">
        <div className="w-16 h-16 rounded-full bg-sage/20 text-sage-dark flex items-center justify-center mx-auto"><PartyPopper size={30}/></div>
        <h1 className="font-display text-2xl text-graphite mt-4">Pedido enviado!</h1>
        <p className="text-graphite-light/80 mt-2">Obrigado! {mockUser.name} recebeu seu pedido e entrará em contato. 💚</p>
      </div>
    </CenterMsg>
  );

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-white border-b border-cream-dark/60 px-5 py-5 text-center">
        <div className="flex justify-center"><Logo size={52} withText={false} /></div>
        <h1 className="font-display text-2xl text-graphite mt-3">{mockUser.name}</h1>
        <p className="text-graphite-light/80 text-sm mt-1 max-w-md mx-auto">{link.welcomeMessage}</p>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 pb-40">
        {step === "menu" ? (
          <>
            <h2 className="font-display text-xl text-graphite mb-4">{link.title}</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {menuDishes.map((d) => {
                const qty = selected[d.id] ?? 0;
                const active = qty > 0;
                return (
                  <div key={d.id} className={`card overflow-hidden transition ${active ? "ring-2 ring-sage" : ""}`}>
                    <div className="h-44 bg-cream-dark/50 overflow-hidden relative">
                      {d.photoUrl
                        ? <img src={d.photoUrl} alt={d.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-sage"><UtensilsCrossed size={40}/></div>}
                      {active && <span className="absolute top-3 right-3 chip bg-sage text-white"><Check size={12}/> Selecionado</span>}
                    </div>
                    <div className="p-4">
                      <h3 className="font-display text-lg text-graphite">{d.name}</h3>
                      <p className="text-sm text-graphite-light/80 mt-0.5">{d.intro}</p>
                      <p className="text-xs text-graphite-light/70 mt-1">{d.description}</p>
                      <p className="flex items-center gap-1 text-xs text-graphite-light mt-2"><Users size={13}/> Base: {d.baseServings} pessoas</p>

                      {active ? (
                        <div className="mt-3">
                          <label className="label text-xs">Quantas pessoas?</label>
                          <div className="flex items-center gap-2">
                            <button onClick={() => setQty(d.id, qty - 5)} className="btn bg-cream-dark/60 p-2.5 rounded-xl"><Minus size={16}/></button>
                            <input type="number" className="input text-center" value={qty}
                              onChange={(e) => setQty(d.id, Number(e.target.value))} />
                            <button onClick={() => setQty(d.id, qty + 5)} className="btn bg-cream-dark/60 p-2.5 rounded-xl"><Plus size={16}/></button>
                          </div>
                          <button onClick={() => setQty(d.id, 0)} className="text-xs text-peach-dark mt-2 font-semibold">Remover</button>
                        </div>
                      ) : (
                        <button onClick={() => setQty(d.id, d.baseServings)} className="btn-accent w-full mt-3 text-sm">Selecionar</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-4 animate-fade-in max-w-lg mx-auto">
            <h2 className="font-display text-xl text-graphite">Seus dados</h2>
            <div>
              <label className="label">Nome completo</label>
              <input className="input" {...register("name")} />
              {errors.name && <p className="text-peach-dark text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Telefone</label>
              <input className="input" placeholder="(11) 99999-9999" {...register("phone")} />
              {errors.phone && <p className="text-peach-dark text-sm mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="label">Observações (opcional)</label>
              <textarea className="input min-h-[80px]" {...register("notes")} />
            </div>

            <div className="bg-cream-dark/30 rounded-2xl p-4">
              <p className="font-semibold text-sm mb-2 flex items-center gap-1.5"><ShoppingBasket size={15}/> Resumo do pedido</p>
              {selectedList.map(([id, n]) => (
                <div key={id} className="flex justify-between text-sm py-0.5">
                  <span>{dishesById[id].name}</span><span className="text-graphite-light">{n} pessoas</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("menu")} className="btn-ghost flex-1">Voltar</button>
              <button type="submit" disabled={isSubmitting} className="btn-primary flex-1"><Send size={17}/> Enviar pedido</button>
            </div>
          </form>
        )}
      </main>

      {step === "menu" && selectedList.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-cream-dark/60 px-4 py-3">
          <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
            <div className="text-sm">
              <p className="font-semibold text-graphite">{selectedList.length} prato(s)</p>
              <p className="text-graphite-light/80 text-xs">{selectedList.reduce((s, [, n]) => s + n, 0)} pessoas no total</p>
            </div>
            <button onClick={() => setStep("form")} className="btn-accent">Continuar <Send size={16}/></button>
          </div>
        </div>
      )}
    </div>
  );
}

function CenterMsg({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center p-6 bg-cream">{children}</div>;
}
