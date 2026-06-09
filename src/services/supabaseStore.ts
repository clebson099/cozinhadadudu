import { supabase } from "./supabaseClient";
import type { DishRepository, MenuLinkRepository, OrderRepository } from "./repositories";
import type {
  Dish, DishIngredient, MenuLink, Order, OrderDish, ShoppingItem, Unit, LinkValidityDays,
} from "@/types";

// Guard: garante que o client existe (evita "null" em runtime).
function db() {
  if (!supabase) throw new Error("Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.");
  return supabase;
}

const uid = () => crypto.randomUUID();
const slugify = () => Math.random().toString(36).slice(2, 8);

// =====================================================================
//  MAPPERS — banco (snake_case) <-> app (camelCase)
// =====================================================================
type DishRow = {
  id: string; name: string; photo_url: string | null; intro: string | null;
  description: string | null; base_servings: number; active: boolean; created_at: string;
};
type DishIngredientRow = {
  id: string; dish_id: string; ingredient_id: string | null;
  name: string; quantity: number; unit: Unit;
};

function rowToDish(d: DishRow, ings: DishIngredientRow[]): Dish {
  return {
    id: d.id,
    name: d.name,
    photoUrl: d.photo_url ?? undefined,
    intro: d.intro ?? "",
    description: d.description ?? "",
    baseServings: d.base_servings,
    active: d.active,
    createdAt: d.created_at,
    ingredients: ings.map<DishIngredient>((i) => ({
      ingredientId: i.ingredient_id ?? i.id,
      name: i.name, quantity: Number(i.quantity), unit: i.unit,
    })),
  };
}

// =====================================================================
//  DISHES
// =====================================================================
export const supabaseDishRepo: DishRepository = {
  async list() {
    const { data: dishes, error } = await db()
      .from("dishes").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    const ids = (dishes ?? []).map((d) => d.id);
    let ings: DishIngredientRow[] = [];
    if (ids.length) {
      const { data, error: e2 } = await db()
        .from("dish_ingredients").select("*").in("dish_id", ids);
      if (e2) throw e2;
      ings = (data ?? []) as DishIngredientRow[];
    }
    return (dishes ?? []).map((d) =>
      rowToDish(d as DishRow, ings.filter((i) => i.dish_id === d.id)));
  },

  async get(id) {
    const { data: d, error } = await db().from("dishes").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    if (!d) return null;
    const { data: ings } = await db().from("dish_ingredients").select("*").eq("dish_id", id);
    return rowToDish(d as DishRow, (ings ?? []) as DishIngredientRow[]);
  },

  async create(dish) {
    const { data, error } = await db().from("dishes").insert({
      name: dish.name, photo_url: dish.photoUrl ?? null, intro: dish.intro,
      description: dish.description, base_servings: dish.baseServings, active: dish.active,
    }).select("*").single();
    if (error) throw error;
    const created = data as DishRow;
    if (dish.ingredients.length) {
      const { error: e2 } = await db().from("dish_ingredients").insert(
        dish.ingredients.map((i) => ({
          dish_id: created.id, name: i.name, quantity: i.quantity, unit: i.unit,
        }))
      );
      if (e2) throw e2;
    }
    return (await this.get(created.id))!;
  },

  async update(id, patch) {
    const fields: Record<string, unknown> = {};
    if (patch.name !== undefined) fields.name = patch.name;
    if (patch.photoUrl !== undefined) fields.photo_url = patch.photoUrl ?? null;
    if (patch.intro !== undefined) fields.intro = patch.intro;
    if (patch.description !== undefined) fields.description = patch.description;
    if (patch.baseServings !== undefined) fields.base_servings = patch.baseServings;
    if (patch.active !== undefined) fields.active = patch.active;
    if (Object.keys(fields).length) {
      const { error } = await db().from("dishes").update(fields).eq("id", id);
      if (error) throw error;
    }
    if (patch.ingredients) {
      await db().from("dish_ingredients").delete().eq("dish_id", id);
      if (patch.ingredients.length) {
        const { error } = await db().from("dish_ingredients").insert(
          patch.ingredients.map((i) => ({
            dish_id: id, name: i.name, quantity: i.quantity, unit: i.unit,
          }))
        );
        if (error) throw error;
      }
    }
    return (await this.get(id))!;
  },

  async remove(id) {
    const { error } = await db().from("dishes").delete().eq("id", id);
    if (error) throw error;
  },
};

// =====================================================================
//  MENU LINKS
// =====================================================================
type MenuLinkRow = {
  id: string; slug: string; title: string; welcome_message: string | null;
  validity_days: LinkValidityDays; created_at: string; expires_at: string;
};

async function rowToMenuLink(l: MenuLinkRow): Promise<MenuLink> {
  const { data: links } = await db()
    .from("menu_link_dishes").select("dish_id").eq("menu_link_id", l.id);
  return {
    id: l.id, slug: l.slug, title: l.title,
    welcomeMessage: l.welcome_message ?? "",
    validityDays: l.validity_days,
    createdAt: l.created_at, expiresAt: l.expires_at,
    dishIds: (links ?? []).map((x) => x.dish_id as string),
  };
}

export const supabaseMenuLinkRepo: MenuLinkRepository = {
  async list() {
    const { data, error } = await db()
      .from("menu_links").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return Promise.all((data ?? []).map((l) => rowToMenuLink(l as MenuLinkRow)));
  },

  async getBySlug(slug) {
    const { data, error } = await db().from("menu_links").select("*").eq("slug", slug).maybeSingle();
    if (error) throw error;
    return data ? rowToMenuLink(data as MenuLinkRow) : null;
  },

  async create(link) {
    const now = new Date();
    const expires = new Date(now.getTime() + link.validityDays * 86400000);
    const { data, error } = await db().from("menu_links").insert({
      slug: slugify(), title: link.title, welcome_message: link.welcomeMessage,
      validity_days: link.validityDays, expires_at: expires.toISOString(),
    }).select("*").single();
    if (error) throw error;
    const created = data as MenuLinkRow;
    if (link.dishIds.length) {
      const { error: e2 } = await db().from("menu_link_dishes").insert(
        link.dishIds.map((dish_id) => ({ menu_link_id: created.id, dish_id }))
      );
      if (e2) throw e2;
    }
    return rowToMenuLink(created);
  },

  async remove(id) {
    const { error } = await db().from("menu_links").delete().eq("id", id);
    if (error) throw error;
  },
};

// =====================================================================
//  ORDERS
// =====================================================================
type OrderRow = {
  id: string; menu_link_id: string | null; customer_name: string; customer_phone: string;
  notes: string | null; labor_cost: number; status: "FINALIZADO"; created_at: string;
};

async function rowToOrder(o: OrderRow): Promise<Order> {
  const { data: ods } = await db().from("order_dishes").select("*").eq("order_id", o.id);
  const { data: list } = await db()
    .from("shopping_lists").select("id").eq("order_id", o.id).maybeSingle();
  let items: ShoppingItem[] = [];
  if (list) {
    const { data: sli } = await db()
      .from("shopping_list_items").select("*").eq("shopping_list_id", (list as { id: string }).id);
    items = (sli ?? []).map((s) => ({
      id: s.id as string, name: s.name as string,
      quantity: Number(s.quantity), unit: s.unit as Unit, manual: s.manual as boolean,
    }));
  }
  return {
    id: o.id, menuLinkId: o.menu_link_id ?? undefined,
    customerName: o.customer_name, customerPhone: o.customer_phone,
    notes: o.notes ?? undefined, laborCost: Number(o.labor_cost),
    status: o.status, createdAt: o.created_at,
    dishes: (ods ?? []).map<OrderDish>((d) => ({
      dishId: (d.dish_id as string) ?? "", dishName: d.dish_name as string, servings: d.servings as number,
    })),
    shoppingList: items,
  };
}

export const supabaseOrderRepo: OrderRepository = {
  async list() {
    const { data, error } = await db()
      .from("orders").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return Promise.all((data ?? []).map((o) => rowToOrder(o as OrderRow)));
  },

  async get(id) {
    const { data, error } = await db().from("orders").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToOrder(data as OrderRow) : null;
  },

  async create(order) {
    const { data, error } = await db().from("orders").insert({
      menu_link_id: order.menuLinkId ?? null,
      customer_name: order.customerName, customer_phone: order.customerPhone,
      notes: order.notes ?? null, labor_cost: order.laborCost, status: "FINALIZADO",
    }).select("*").single();
    if (error) throw error;
    const created = data as OrderRow;

    if (order.dishes.length) {
      const { error: e2 } = await db().from("order_dishes").insert(
        order.dishes.map((d) => ({
          order_id: created.id, dish_id: d.dishId || null,
          dish_name: d.dishName, servings: d.servings,
        }))
      );
      if (e2) throw e2;
    }

    // cria a shopping_list + itens
    const { data: sl, error: e3 } = await db()
      .from("shopping_lists").insert({ order_id: created.id }).select("id").single();
    if (e3) throw e3;
    if (order.shoppingList.length) {
      const { error: e4 } = await db().from("shopping_list_items").insert(
        order.shoppingList.map((it) => ({
          shopping_list_id: (sl as { id: string }).id,
          name: it.name, quantity: it.quantity, unit: it.unit, manual: it.manual ?? false,
        }))
      );
      if (e4) throw e4;
    }
    return (await this.get(created.id))!;
  },

  async update(id, patch) {
    const fields: Record<string, unknown> = {};
    if (patch.customerName !== undefined) fields.customer_name = patch.customerName;
    if (patch.customerPhone !== undefined) fields.customer_phone = patch.customerPhone;
    if (patch.notes !== undefined) fields.notes = patch.notes ?? null;
    if (patch.laborCost !== undefined) fields.labor_cost = patch.laborCost;
    if (Object.keys(fields).length) {
      const { error } = await db().from("orders").update(fields).eq("id", id);
      if (error) throw error;
    }

    // se a lista de compras mudou, regrava os itens
    if (patch.shoppingList) {
      let listId: string;
      const { data: existing } = await db()
        .from("shopping_lists").select("id").eq("order_id", id).maybeSingle();
      if (existing) {
        listId = (existing as { id: string }).id;
        await db().from("shopping_list_items").delete().eq("shopping_list_id", listId);
      } else {
        const { data: nl, error } = await db()
          .from("shopping_lists").insert({ order_id: id }).select("id").single();
        if (error) throw error;
        listId = (nl as { id: string }).id;
      }
      if (patch.shoppingList.length) {
        const { error } = await db().from("shopping_list_items").insert(
          patch.shoppingList.map((it) => ({
            shopping_list_id: listId, name: it.name,
            quantity: it.quantity, unit: it.unit, manual: it.manual ?? false,
          }))
        );
        if (error) throw error;
      }
    }
    return (await this.get(id))!;
  },
};

// evita "unused" caso o tree-shaking reclame de uid em algum ambiente
void uid;
