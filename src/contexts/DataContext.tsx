import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Dish, MenuLink, Order } from "@/types";
import { dishService, menuLinkService, orderService } from "@/services";

interface DataContextValue {
  dishes: Dish[];
  links: MenuLink[];
  orders: Order[];
  loading: boolean;
  refresh: () => Promise<void>;
  createDish: (d: Omit<Dish, "id" | "createdAt">) => Promise<void>;
  updateDish: (id: string, d: Partial<Dish>) => Promise<void>;
  removeDish: (id: string) => Promise<void>;
  createLink: (l: Parameters<typeof menuLinkService.create>[0]) => Promise<MenuLink>;
  removeLink: (id: string) => Promise<void>;
  createOrder: (o: Parameters<typeof orderService.create>[0]) => Promise<Order>;
  updateOrder: (id: string, o: Partial<Order>) => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [links, setLinks] = useState<MenuLink[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const [d, l, o] = await Promise.all([
      dishService.list(), menuLinkService.list(), orderService.list(),
    ]);
    setDishes(d); setLinks(l); setOrders(o); setLoading(false);
  };

  useEffect(() => { refresh(); }, []);

  const value: DataContextValue = {
    dishes, links, orders, loading, refresh,
    createDish: async (d) => { await dishService.create(d); await refresh(); },
    updateDish: async (id, d) => { await dishService.update(id, d); await refresh(); },
    removeDish: async (id) => { await dishService.remove(id); await refresh(); },
    createLink: async (l) => { const r = await menuLinkService.create(l); await refresh(); return r; },
    removeLink: async (id) => { await menuLinkService.remove(id); await refresh(); },
    createOrder: async (o) => { const r = await orderService.create(o); await refresh(); return r; },
    updateOrder: async (id, o) => { await orderService.update(id, o); await refresh(); },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
