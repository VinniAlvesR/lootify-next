import { NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const next = url.searchParams.get("next") ?? "/"

  // 1) Prepara a response (onde vamos gravar os cookies da sessão)
  const res = NextResponse.redirect(new URL(next, url.origin))

  // 2) Client SSR do Supabase acoplado à req/res para ler/gravar cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          res.cookies.set(name, value, options)
        },
        remove(name: string, options: CookieOptions) {
          res.cookies.set(name, "", { ...options, maxAge: 0 })
        },
      },
    }
  )

  // 3) Troca o code do magic link por sessão (grava nos cookies da 'res')
  if (code) {
    await supabase.auth.exchangeCodeForSession(code)
  }

  // 4) Redireciona já autenticado
  return res
}
