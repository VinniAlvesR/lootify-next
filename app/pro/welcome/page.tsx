"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProWelcomePage() {
  const [loading, setLoading] = useState(true)
  const [isPro, setIsPro] = useState(false)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      // 1️⃣ verifica se usuário está logado
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) {
        router.push("/pro")
        return
      }

      // 2️⃣ lê status do perfil
      const { data } = await supabase.from("profiles").select("is_pro").eq("id", user.id).single()

      const proStatus = !!data?.is_pro
      setIsPro(proStatus)

      // 3️⃣ checa se já viu a página
      const seen = localStorage.getItem("lootify_pro_welcome_seen")
      if (proStatus && !seen) {
        localStorage.setItem("lootify_pro_welcome_seen", "1")
        setLoading(false)
      } else {
        router.push("/pro")
      }
    })()
  }, [router])

  if (loading) return null
  if (!isPro) return null

  return (
    <div className="mx-auto max-w-2xl text-center mt-16 space-y-8">
      <h1 className="text-4xl font-bold text-blue-400">✨ Bem-vindo ao Lootify Pro!</h1>
      <p className="text-white/80 text-lg leading-relaxed">
        Agora você tem acesso a todos os recursos premium do Lootify:
      </p>

      <ul className="text-left inline-block text-white/70 text-base leading-7">
        <li>✅ Favoritos ilimitados</li>
        <li>🔔 Alertas automáticos de queda de preço</li>
        <li>📈 Histórico diário de ofertas</li>
        <li>🚀 Atualizações exclusivas antes dos outros</li>
      </ul>

      <p className="text-white/60 text-sm">Obrigado por apoiar o Lootify e fazer parte da comunidade Pro 💙</p>

      <div className="flex justify-center gap-3 mt-6">
        <button
          onClick={() => router.push("/")}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 transition-colors"
        >
          Explorar ofertas
        </button>

        <button
          onClick={() => router.push("/pro")}
          className="rounded-xl border border-white/15 px-5 py-3 font-medium hover:bg-white/5 transition-colors"
        >
          Ver detalhes do plano
        </button>
      </div>
    </div>
  )
}
