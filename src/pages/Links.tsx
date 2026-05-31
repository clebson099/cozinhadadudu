import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link2, Copy, Check, Trash2, ExternalLink, Plus, Clock } from "lucide-react";
import { menuLinkSchema, type MenuLinkFormValues } from "@/utils/schemas";
import { useData } from "@/contexts/DataContext";
import { useClipboard } from "@/hooks/useClipboard";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import { formatDate } from "@/utils/format";

const validities = [1, 3, 7, 15, 30] as const;

export default function Links() {
  const { dishes, links, createLink, removeLink } = useData();
  const [open, setOpen] = useState(false);
  const { copied, copy } = useClipboard();
  const [copiedId, setCopiedId] = useState<string>();

  const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || window.location.origin;
  const fullUrl = (slug: string) => `${baseUrl}/cardapio/${slug}`;

  const { register, handleSubmit, reset, formState: { errors } } = useForm<MenuLinkFormValues>({
    resolver: zodResolver(menuLinkSchema),
    defaultValues: { title: "", welcomeMessage: "Seja bem-vindo(a)! Escolha seus pratos e a quantidade de pessoas.", dishIds: [], validityDays: 7 },
  });

  const onSubmit = async (v: MenuLinkFormValues) => {
    await createLink(v); reset(); setOpen(false);
  };

  const handleCopy = (slug: string, id: string) => { copy(fullUrl(slug)); setCopiedId(id); };

  return (
    <div>
      <PageHeader title="Links de cardápio" subtitle="Gere um link e envie ao seu cliente. Sem login."
        action={<button onClick={() => setOpen((o) => !o)} className="btn-accent"><Plus size={18}/> Novo link</button>} />

      {open && (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-5 sm:p-6 mb-6 space-y-4 animate-fade-in">
          <div>
            <label className="label">Título do cardápio</label>
            <input className="input" placeholder="Ex: Cardápio de Festas" {...register("title")} />
            {errors.title && <p className="text-peach-dark text-sm mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Mensagem de boas-vindas</label>
            <textarea className="input min-h-[72px]" {...register("welcomeMessage")} />
          </div>
          <div>
            <label className="label">Pratos incluídos</label>
            <div className="grid sm:grid-cols-2 gap-2">
              {dishes.map((d) => (
                <label key={d.id} className="flex items-center gap-3 p-3 rounded-2xl border border-cream-dark cursor-pointer hover:bg-cream-dark/30 transition">
                  <input type="checkbox" value={d.id} {...register("dishIds")} className="w-5 h-5 accent-sage" />
                  <span className="text-sm font-medium text-graphite">{d.name}</span>
                </label>
              ))}
            </div>
            {errors.dishIds && <p className="text-peach-dark text-sm mt-1">{errors.dishIds.message}</p>}
          </div>
          <div>
            <label className="label">Validade do link</label>
            <select className="input w-48" {...register("validityDays", { valueAsNumber: true })}>
              {validities.map((v) => <option key={v} value={v}>{v} {v === 1 ? "dia" : "dias"}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-sage"><Link2 size={18}/> Gerar link</button>
        </form>
      )}

      {links.length === 0 ? (
        <EmptyState icon={Link2} title="Nenhum link criado" subtitle="Crie um link para compartilhar seu cardápio com clientes." />
      ) : (
        <div className="space-y-3">
          {links.map((l) => {
            const expired = new Date(l.expiresAt).getTime() < Date.now();
            return (
              <div key={l.id} className="card p-5 animate-fade-in">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display text-lg text-graphite">{l.title}</h3>
                      <span className={`chip ${expired ? "bg-peach/20 text-peach-dark" : "bg-sage/20 text-sage-dark"}`}>
                        <Clock size={12}/> {expired ? "Expirado" : `Expira ${formatDate(l.expiresAt)}`}
                      </span>
                    </div>
                    <p className="text-sm text-graphite-light/80 mt-0.5">{l.dishIds.length} pratos</p>
                    <code className="block mt-2 text-xs sm:text-sm bg-cream-dark/40 rounded-xl px-3 py-2 truncate text-graphite-light">{fullUrl(l.slug)}</code>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleCopy(l.slug, l.id)} className="btn-ghost flex-1 text-sm">
                    {copied && copiedId === l.id ? <><Check size={15}/> Copiado!</> : <><Copy size={15}/> Copiar</>}
                  </button>
                  <a href={fullUrl(l.slug)} target="_blank" rel="noreferrer" className="btn-ghost flex-1 text-sm"><ExternalLink size={15}/> Abrir</a>
                  <button onClick={() => confirm("Excluir este link?") && removeLink(l.id)}
                    className="btn bg-peach/20 text-peach-dark px-4 py-2.5 text-sm"><Trash2 size={15}/></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
