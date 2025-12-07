"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabaseBrowser } from "@/lib/supabase-browser"

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 🔹 Pega o "code" que vem na URL do Supabase
  const code = searchParams.get("code")
  const next = searchParams.get("next") || "/"

  useEffect(() => {
    async function finishLogin() {
      // Se não tiver code, só manda embora
      if (!code) {
        router.replace(next)
        return
      }

      const supabase = supabaseBrowser

      // 🔹 Aqui é onde a sessão realmente é criada
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error("Erro ao finalizar login:", error)
        router.replace("/?login_error=1")
        return
      }

      // 🔹 Se deu certo, manda pra página final
      router.replace(next)
    }

    finishLogin()
  }, [code, next, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Finalizando login, aguarde um instante...</p>
    </div>
  )
}
