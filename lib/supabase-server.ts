// Helpers SSR oficiais: lida com cookies em Next (Route Handlers, Server Components, Middleware).
import { createServerClient } from "@supabase/ssr"
import type { NextRequest, NextResponse } from "next/server"

const url  = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Fábrica para server (req/res) — mantém sessão via cookies.
export function supabaseServer(req: NextRequest, res: NextResponse) {
  return createServerClient(url, anon, {
    cookies: {
      // Lê um cookie específico da request.
      get(name)   { return req.cookies.get(name)?.value },
      // Seta cookie na response (para atualizar tokens de sessão).
      set(name, value, options) { res.cookies.set(name, value, options) },
      // Remove cookie (logout / invalidação).
      remove(name, options) { res.cookies.delete(name) },
    },
  })
}
