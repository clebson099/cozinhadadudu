// Domain types — mirror the planned Supabase schema.

export type Unit =
  | "kg" | "g" | "l" | "ml" | "un" | "caixa" | "pacote" | "bandeja";

export const UNIT_LABELS: Record<Unit, string> = {
  kg: "Kg", g: "Gramas", l: "Litros", ml: "Mililitros",
  un: "Unidade", caixa: "Caixa", pacote: "Pacote", bandeja: "Bandeja",
};

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  logoUrl?: string;
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: Unit;
  createdAt: string;
}

export interface DishIngredient {
  ingredientId: string;
  name: string;       // denormalized for convenience with mock data
  quantity: number;   // base quantity for `baseServings`
  unit: Unit;
}

export interface Dish {
  id: string;
  name: string;
  photoUrl?: string;
  intro: string;
  description: string;
  baseServings: number;
  ingredients: DishIngredient[];
  active: boolean;
  createdAt: string;
}

export type LinkValidityDays = 1 | 3 | 7 | 15 | 30;

export interface MenuLink {
  id: string;
  slug: string;
  title: string;
  welcomeMessage: string;
  dishIds: string[];
  validityDays: LinkValidityDays;
  createdAt: string;
  expiresAt: string;
}

export interface OrderDish {
  dishId: string;
  dishName: string;
  servings: number;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  manual?: boolean;
}

export type OrderStatus = "FINALIZADO";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Order {
  id: string;
  menuLinkId?: string;
  customerName: string;
  customerPhone: string;
  notes?: string;
  dishes: OrderDish[];
  shoppingList: ShoppingItem[];
  laborCost: number;
  status: OrderStatus;
  createdAt: string;
}
