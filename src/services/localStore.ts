import type { Dish, MenuLink, Order } from "@/types";
import type { DishRepository, MenuLinkRepository, OrderRepository } from "./repositories";
import { mockDishes, mockMenuLinks, mockOrders } from "@/mock/data";
import { slugify } from "@/utils/format";

const KEYS = { dishes: "cdd_dishes", links: "cdd_links", orders: "cdd_orders" };

function load<T>(key: string, seed: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as T[];
  } catch { /* ignore */ }
  localStorage.setItem(key, JSON.stringify(seed));
  return seed;
}
function save<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}
const uid = () => crypto.randomUUID();

export const localDishRepo: DishRepository = {
  async list() { return load(KEYS.dishes, mockDishes); },
  async get(id) { return (await this.list()).find((d) => d.id === id) ?? null; },
  async create(dish) {
    const list = await this.list();
    const created: Dish = { ...dish, id: uid(), createdAt: new Date().toISOString() };
    save(KEYS.dishes, [created, ...list]);
    return created;
  },
  async update(id, patch) {
    const list = await this.list();
    const next = list.map((d) => (d.id === id ? { ...d, ...patch } : d));
    save(KEYS.dishes, next);
    return next.find((d) => d.id === id)!;
  },
  async remove(id) {
    const list = await this.list();
    save(KEYS.dishes, list.filter((d) => d.id !== id));
  },
};

export const localMenuLinkRepo: MenuLinkRepository = {
  async list() { return load(KEYS.links, mockMenuLinks); },
  async getBySlug(slug) { return (await this.list()).find((l) => l.slug === slug) ?? null; },
  async create(link) {
    const list = await this.list();
    const now = new Date();
    const expires = new Date(now.getTime() + link.validityDays * 86400000);
    const created: MenuLink = {
      ...link, id: uid(), slug: slugify(),
      createdAt: now.toISOString(), expiresAt: expires.toISOString(),
    };
    save(KEYS.links, [created, ...list]);
    return created;
  },
  async remove(id) {
    const list = await this.list();
    save(KEYS.links, list.filter((l) => l.id !== id));
  },
};

export const localOrderRepo: OrderRepository = {
  async list() { return load(KEYS.orders, mockOrders); },
  async get(id) { return (await this.list()).find((o) => o.id === id) ?? null; },
  async create(order) {
    const list = await this.list();
    const created: Order = {
      ...order, id: uid(), status: "FINALIZADO", createdAt: new Date().toISOString(),
    };
    save(KEYS.orders, [created, ...list]);
    return created;
  },
  async update(id, patch) {
    const list = await this.list();
    const next = list.map((o) => (o.id === id ? { ...o, ...patch } : o));
    save(KEYS.orders, next);
    return next.find((o) => o.id === id)!;
  },
};
