import type { Dish, MenuLink, Order } from "@/types";

// Repository Pattern — swap localStorage impl for Supabase impl later
// without touching the UI/hooks layer.
export interface DishRepository {
  list(): Promise<Dish[]>;
  get(id: string): Promise<Dish | null>;
  create(dish: Omit<Dish, "id" | "createdAt">): Promise<Dish>;
  update(id: string, dish: Partial<Dish>): Promise<Dish>;
  remove(id: string): Promise<void>;
}

export interface MenuLinkRepository {
  list(): Promise<MenuLink[]>;
  getBySlug(slug: string): Promise<MenuLink | null>;
  create(link: Omit<MenuLink, "id" | "createdAt" | "expiresAt" | "slug">): Promise<MenuLink>;
  remove(id: string): Promise<void>;
}

export interface OrderRepository {
  list(): Promise<Order[]>;
  get(id: string): Promise<Order | null>;
  create(order: Omit<Order, "id" | "createdAt" | "status">): Promise<Order>;
  update(id: string, order: Partial<Order>): Promise<Order>;
}
