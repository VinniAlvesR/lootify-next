"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function ProManagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null)
  const [checking, setChecking] = useState(true)

  // 🔹 Ao carregar a página, buscamos a sessão e o ID da assinatura
  useEffect(() => {
    ;(async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          setChecking(false)
          return
        }

        // ⚠️ AJUSTE AQUI: caminho do subscriptionId no user_metadata
        const subId =
          (session.user as any)?.user_metadata?.stripe_subscription_id ||
          (session.user as any)?.user_metadata?.subscription_id ||
          null

        setSubscriptionId(subId)
      } catch (err) {
        console.error("Erro ao buscar sessão:", err)
      } finally {
        setChecking(false)
      }
    })()
  }, [])

  async function handleCancel() {
    if (!subscriptionId) {
      alert("Não encontramos sua assinatura para cancelar. Fale com o suporte.")
      return
    }

    const sure = confirm("Tem certeza que deseja cancelar seu Lootify Pro?")
    if (!sure) return

    try {
      setLoading(true)

      const res = await fetch("/api/stripe/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscriptionId }),
      })

      if (!res.ok) {
        console.error("Erro ao cancelar assinatura:", await res.text())
        alert("Não foi possível cancelar a assinatura. Tente novamente.")
        return
      }

      // 🔥 Se deu certo, vai pra página de confirmação
      router.push("/pro/cancelled")
    } catch (err) {
      console.error(err)
      alert("Erro inesperado ao cancelar a assinatura.")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="mx-auto max-w-2xl text-center mt-16 px-4 text-white/70">
        Carregando informações da sua assinatura...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center mt-16 px-4">
      <h1 className="text-3xl font-semibold text-white">Gerenciar plano Pro</h1>

      <p className="text-white/80">
        Aqui você pode visualizar as informações do seu Lootify Pro e cancelar sua assinatura quando quiser.
      </p>

      {subscriptionId ? (
        <>
          <div className="rounded-xl border border-white/10 bg-white/5/5 px-5 py-4 text-left text-sm text-white/80">
            <p className="font-medium mb-1">Status atual: <span className="text-green-400">Ativo</span></p>
            <p className="text-xs text-white/50">
              Sua assinatura está ativa. Ao cancelar, nenhuma nova cobrança será feita e você manterá acesso até o fim do período já pago.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <Link
              href="/"
              className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 transition-colors"
            >
              Voltar para o Lootify
            </Link>

            <button
              onClick={handleCancel}
              disabled={loading}
              className="rounded-xl border border-red-500/60 px-5 py-3 font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-60"
            >
              {loading ? "Cancelando..." : "Cancelar assinatura"}
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-xl border border-yellow-400/40 bg-yellow-500/5 px-5 py-4 text-sm text-yellow-100">
          <p className="font-medium mb-1">Nenhuma assinatura encontrada</p>
          <p className="text-xs">
            Não conseguimos localizar uma assinatura Pro vinculada à sua conta. Se você acredita que isso é um erro,
            entre em contato com o suporte.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex rounded-xl bg-blue-600 px-4 py-2 text-xs font-medium hover:bg-blue-500 transition-colors"
            >
              Voltar para o Lootify
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
