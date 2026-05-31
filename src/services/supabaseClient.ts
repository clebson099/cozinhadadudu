// Supabase client — prepared but NOT active yet.
// When ready: `npm i @supabase/supabase-js`, fill .env, then uncomment.
//
// import { createClient } from "@supabase/supabase-js";
// import type { Database } from "@/types/database";
//
// const url = import.meta.env.VITE_SUPABASE_URL;
// const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
// export const supabase = createClient<Database>(url, key);

export const SUPABASE_ENABLED = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);
