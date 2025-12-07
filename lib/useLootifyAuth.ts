"use client"

import { useEffect, useState } from "react"
import { supabaseBrowser } from "@/lib/supabase-browser"

type LootifyUser = {
  id: string
  email: string | null
}

export function useLootifyAuth() {
  const [user, setUser] = useState<LootifyUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    async function loadSession() {
      // 1) Busca a sessão atual salva pelo Supabase no navegador
      const { data } = await supabaseBrowser.auth.getSession()

      // 2) Se o efeito ainda estiver ativo, atualiza o estado
      if (!ignore) {
        const sessionUser = data.session?.user ?? null
        setUser(
          sessionUser
            ? { id: sessionUser.id, email: sessionUser.email ?? null }
            : null,
        )
        setLoading(false)
      }
    }

    loadSession()

    // 3) Escuta mudanças de login / logout em tempo real
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null
        setUser(
          sessionUser
            ? { id: sessionUser.id, email: sessionUser.email ?? null }
            : null,
        )
      },
    )

    // 4) Limpa o listener quando o componente desmontar
    return () => {
      sub.subscription.unsubscribe()
      ignore = true
    }
  }, [])

  // 5) Retorna usuário e estado de carregamento
  return { user, loading }
}
