// Supabase database typing placeholder.
// Replace with output of: supabase gen types typescript --project-id <id>
export interface Database {
  public: {
    Tables: {
      users: { Row: Record<string, unknown> };
      dishes: { Row: Record<string, unknown> };
      ingredients: { Row: Record<string, unknown> };
      dish_ingredients: { Row: Record<string, unknown> };
      menu_links: { Row: Record<string, unknown> };
      menu_link_dishes: { Row: Record<string, unknown> };
      customers: { Row: Record<string, unknown> };
      orders: { Row: Record<string, unknown> };
      order_dishes: { Row: Record<string, unknown> };
      shopping_lists: { Row: Record<string, unknown> };
      shopping_list_items: { Row: Record<string, unknown> };
    };
  };
}
