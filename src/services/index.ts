import { localDishRepo, localMenuLinkRepo, localOrderRepo } from "./localStore";
import type { DishRepository, MenuLinkRepository, OrderRepository } from "./repositories";

// Today: local repositories (mock + localStorage).
// Later: import supabase repos and swap here — nothing else changes.
export const dishService: DishRepository = localDishRepo;
export const menuLinkService: MenuLinkRepository = localMenuLinkRepo;
export const orderService: OrderRepository = localOrderRepo;

export * from "./repositories";
