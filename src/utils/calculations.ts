import type { Dish, OrderDish, ShoppingItem } from "@/types";

/**
 * Scales a dish's base ingredients proportionally to the requested servings.
 * Example: base 10 ppl / 2kg feijão, requested 50 ppl => 10kg feijão.
 */
export function scaleDishIngredients(dish: Dish, servings: number) {
  const factor = servings / dish.baseServings;
  return dish.ingredients.map((ing) => ({
    ingredientId: ing.ingredientId,
    name: ing.name,
    unit: ing.unit,
    quantity: Math.round(ing.quantity * factor * 1000) / 1000,
  }));
}

/**
 * Builds a consolidated shopping list from selected dishes + servings.
 * Same ingredient (by id+unit) is summed; no duplicates.
 */
export function buildShoppingList(
  selected: OrderDish[],
  dishesById: Record<string, Dish>
): ShoppingItem[] {
  const map = new Map<string, ShoppingItem>();
  for (const sel of selected) {
    const dish = dishesById[sel.dishId];
    if (!dish) continue;
    for (const ing of scaleDishIngredients(dish, sel.servings)) {
      const key = `${ing.name}__${ing.unit}`;
      const existing = map.get(key);
      if (existing) {
        existing.quantity = Math.round((existing.quantity + ing.quantity) * 1000) / 1000;
      } else {
        map.set(key, {
          id: key,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
        });
      }
    }
  }
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export const totalServings = (dishes: OrderDish[]) =>
  dishes.reduce((s, d) => s + d.servings, 0);
