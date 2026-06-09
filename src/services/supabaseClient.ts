// Supabase client — ativo quando as variáveis de ambiente estão presentes.
// Requer: npm i @supabase/supabase-js
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

// true quando ha URL + ANON KEY configuradas no .env
export const SUPABASE_ENABLED = Boolean(url && key);

// So cria o client se houver credenciais — assim o app continua
// funcionando em modo local (mock/localStorage) quando nao configurado.
export const supabase: SupabaseClient | null = SUPABASE_ENABLED
  ? createClient(url as string, key as string)
  : null;
