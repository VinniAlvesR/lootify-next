"use client"

import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function ProPage() {
  const url = process.env.NEXT_PUBLIC_PRO_PLAN_URL || "#"
  const [loading, setLoading] = useState(true)
  const [pro, setPro] = useState(false)

  useEffect(() => {
    ;(async () => {
      // pega sessão/logado
      const {
        data: { session },
      } = await supabase.auth.getSession()
      const user = session?.user ?? null

      if (!user) {
        setPro(false)
        setLoading(false)
        return
      }

      // lê is_pro do perfil real
      const { data, error } = await supabase.from("profiles").select("is_pro").eq("id", user.id).single()

      setPro(!error && !!data?.is_pro)
      setLoading(false)
    })()
  }, [])

  async function openPortal() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        alert("Faça login para gerenciar sua assinatura.")
        return
      }

      // chama a Edge Function billing-portal, que abre o Stripe Customer Portal
      const res = await fetch("https://jqtnchstfyaczmfxwlef.functions.supabase.co/billing-portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      })
      const data = await res.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        alert("Não foi possível abrir o portal Stripe.")
      }
    } catch (err) {
      alert("Erro ao abrir o portal Stripe.")
    }
  }

  if (loading) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-semibold">Plano Pro</h1>

      {pro ? (
        <>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
            <div className="text-emerald-300 font-semibold">Você é Pro ✅</div>
            <p className="text-white/80 text-sm">
              Favoritos ilimitados, preço-alvo por jogo e alertas de preço liberados.
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={openPortal}
              className="rounded-xl border border-white/15 px-5 py-3 font-medium hover:bg-white/5"
            >
              Cancelar / Gerenciar assinatura
            </button>

            <Link href="/" className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500">
              Explorar ofertas
            </Link>
          </div>

          <p className="text-xs text-white/50">
            Você pode cancelar, reativar ou trocar pagamento direto no portal Stripe.
          </p>
        </>
      ) : (
        <>
          <p className="text-white/80">
            Desbloqueie <span className="font-semibold">favoritos ilimitados</span>,{" "}
            <span className="font-semibold">preço-alvo por jogo</span> e{" "}
            <span className="font-semibold">alertas inteligentes de preço</span> nos seus jogos favoritos.
          </p>

          <ul className="list-inside list-disc text-white/80 space-y-1">
            <li>Favoritar e organizar quantos jogos você quiser.</li>
            <li>Definir um preço-alvo para cada jogo da sua lista.</li>
            <li>Receber alerta visual quando o preço ficar abaixo do alvo.</li>
            <li>Em breve: histórico de ofertas dos seus jogos acompanhados.</li>
          </ul>

          <div className="flex gap-3 flex-wrap">
            <a href={url} className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500">
              Assinar Pro — R$4,90/mês
            </a>

            <Link href="/" className="rounded-xl border border-white/10 px-5 py-3 font-medium hover:bg-white/5">
              Voltar
            </Link>
          </div>

          <p className="text-xs text-white/50">
            Pagamento via Stripe seguro. Sem fidelidade. Você pode cancelar quando quiser.
          </p>
        </>
      )}
    </div>
  )
}
