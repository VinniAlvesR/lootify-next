// lib/supabase-browser.ts
import { createClient } from "@supabase/supabase-js"

// 🔹 Cria o client que vai rodar no navegador (lado do cliente)
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,       // URL do seu projeto Supabase
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!  // Chave pública (anon key)
)
