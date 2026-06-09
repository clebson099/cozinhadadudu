import { localDishRepo, localMenuLinkRepo, localOrderRepo } from "./localStore";
import { supabaseDishRepo, supabaseMenuLinkRepo, supabaseOrderRepo } from "./supabaseStore";
import { SUPABASE_ENABLED } from "./supabaseClient";
import type { DishRepository, MenuLinkRepository, OrderRepository } from "./repositories";

// =====================================================================
//  INTERRUPTOR DE FONTE DE DADOS
//  - Se VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY existirem  -> Supabase (nuvem)
//  - Caso contrário                                           -> local (mock + localStorage)
//  A UI e os hooks não mudam: só trocamos qual repositório é exportado.
// =====================================================================
export const dishService: DishRepository = SUPABASE_ENABLED ? supabaseDishRepo : localDishRepo;
export const menuLinkService: MenuLinkRepository = SUPABASE_ENABLED ? supabaseMenuLinkRepo : localMenuLinkRepo;
export const orderService: OrderRepository = SUPABASE_ENABLED ? supabaseOrderRepo : localOrderRepo;

export const DATA_SOURCE: "supabase" | "local" = SUPABASE_ENABLED ? "supabase" : "local";

export * from "./repositories";
