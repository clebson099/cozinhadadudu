import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";
import { dishSchema, type DishFormValues } from "@/utils/schemas";
import { useData } from "@/contexts/DataContext";
import { UNIT_LABELS, type Unit } from "@/types";
import PageHeader from "@/components/PageHeader";

const units = Object.keys(UNIT_LABELS) as Unit[];

export default function DishForm() {
  const { id } = useParams();
  const { dishes, createDish, updateDish } = useData();
  const navigate = useNavigate();
  const editing = dishes.find((d) => d.id === id);

  const { register, control, handleSubmit, reset, watch, formState: { errors, isSubmitting } } =
    useForm<DishFormValues>({
      resolver: zodResolver(dishSchema),
      defaultValues: {
        name: "", photoUrl: "", intro: "", description: "", baseServings: 10,
        ingredients: [{ name: "", quantity: 1, unit: "kg" }],
      },
    });
  const { fields, append, remove } = useFieldArray({ control, name: "ingredients" });

  useEffect(() => {
    if (editing) {
      reset({
        name: editing.name, photoUrl: editing.photoUrl ?? "", intro: editing.intro,
        description: editing.description, baseServings: editing.baseServings,
        ingredients: editing.ingredients.map((i) => ({ name: i.name, quantity: i.quantity, unit: i.unit })),
      });
    }
  }, [editing, reset]);

  const photo = watch("photoUrl");

  const onSubmit = async (v: DishFormValues) => {
    const payload = {
      name: v.name, photoUrl: v.photoUrl || undefined, intro: v.intro,
      description: v.description, baseServings: v.baseServings, active: true,
      ingredients: v.ingredients.map((i, idx) => ({
        ingredientId: editing?.ingredients[idx]?.ingredientId ?? crypto.randomUUID(),
        name: i.name, quantity: i.quantity, unit: i.unit,
      })),
    };
    if (editing) await updateDish(editing.id, payload);
    else await createDish(payload);
    navigate("/pratos");
  };

  return (
    <div className="animate-fade-in">
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 text-sm"><ArrowLeft size={16}/> Voltar</button>
      <PageHeader title={editing ? "Editar prato" : "Novo prato"}
        subtitle="As quantidades são a base para o número de pessoas informado." />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="card p-5 sm:p-6 space-y-4">
          <div>
            <label className="label">Nome do prato</label>
            <input className="input" placeholder="Ex: Feijoada Completa" {...register("name")} />
            {errors.name && <p className="text-peach-dark text-sm mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="label">Foto (URL)</label>
            <input className="input" placeholder="https://..." {...register("photoUrl")} />
            {photo && <img src={photo} alt="" className="mt-3 h-32 w-full object-cover rounded-2xl" />}
          </div>
          <div>
            <label className="label">Introdução</label>
            <input className="input" placeholder="Prato tradicional brasileiro..." {...register("intro")} />
            {errors.intro && <p className="text-peach-dark text-sm mt-1">{errors.intro.message}</p>}
          </div>
          <div>
            <label className="label">Descrição</label>
            <textarea className="input min-h-[88px]" placeholder="Acompanha arroz, couve, farofa..." {...register("description")} />
            {errors.description && <p className="text-peach-dark text-sm mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="label">Atende quantas pessoas (base)</label>
            <input type="number" className="input w-40" {...register("baseServings")} />
            {errors.baseServings && <p className="text-peach-dark text-sm mt-1">{errors.baseServings.message}</p>}
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl text-graphite">Ingredientes</h2>
            <button type="button" onClick={() => append({ name: "", quantity: 1, unit: "kg" })}
              className="btn-ghost text-sm"><Plus size={16}/> Adicionar</button>
          </div>
          {errors.ingredients?.root && <p className="text-peach-dark text-sm mb-2">{errors.ingredients.root.message}</p>}
          <div className="space-y-2.5">
            {fields.map((f, i) => (
              <div key={f.id} className="flex gap-2 items-start">
                <input className="input flex-1" placeholder="Ingrediente" {...register(`ingredients.${i}.name`)} />
                <input type="number" step="any" className="input w-24" placeholder="Qtd" {...register(`ingredients.${i}.quantity`)} />
                <select className="input w-32" {...register(`ingredients.${i}.unit`)}>
                  {units.map((u) => <option key={u} value={u}>{UNIT_LABELS[u]}</option>)}
                </select>
                <button type="button" onClick={() => remove(i)} disabled={fields.length === 1}
                  className="btn bg-peach/20 text-peach-dark p-3 rounded-2xl disabled:opacity-40"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1"><Save size={18}/> Salvar prato</button>
        </div>
      </form>
    </div>
  );
}
