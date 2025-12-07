"use client"

import { useEffect, useState } from "react"
import { getDailyDeals, searchDeals, type Deal } from "@/lib/cheapshark"
import GameCard from "@/components/GameCard"
import { useUser } from "@/hooks/useUser"
import Link from "next/link"

export default function HomePage() {
  const { user, loading } = useUser()
  const [deals, setDeals] = useState<Deal[]>([])
  const [q, setQ] = useState("")
  const [loadingDeals, setLoadingDeals] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<number | null>(null)

  async function load(force = false) {
    setLoadingDeals(true)

    try {
      const lastFetch = localStorage.getItem("lootify_last_update")
      const cached = localStorage.getItem("lootify_cached_deals")
      const now = Date.now()
      const oneDay = 24 * 60 * 60 * 1000

      // 🔹 estamos fazendo busca por texto?
      const isSearching = q.trim().length > 0

      // 🔹 SÓ usa cache quando NÃO estiver buscando (q vazio)
      if (!force && !isSearching && lastFetch && cached && now - Number(lastFetch) < oneDay) {
        console.log("✅ Usando cache do Lootify (menos de 24h)")
        setDeals(JSON.parse(cached))
        setLastUpdate(Number(lastFetch))
        setLoadingDeals(false)
        return
      }

      console.log("🔄 Atualizando ofertas...")

      let data: Deal[]

      if (isSearching) {
        // 🔹 Busca por título — NÃO mexe no cache diário
        data = await searchDeals(q.trim())
      } else {
        // 🔹 Lista padrão do dia — aqui sim atualiza o cache
        data = await getDailyDeals(12)
        localStorage.setItem("lootify_cached_deals", JSON.stringify(data))
        localStorage.setItem("lootify_last_update", String(now))
        setLastUpdate(now)
      }

      setDeals(data)
    } catch (err) {
      console.error("Erro ao atualizar ofertas:", err)
    } finally {
      setLoadingDeals(false)
    }
  }

  useEffect(() => {
    const lastFetch = localStorage.getItem("lootify_last_update")
    if (lastFetch) {
      setLastUpdate(Number(lastFetch))
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const hasUser = !!user

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight">🔥 Ofertas de Hoje</h1>
          <p className="text-[11px] sm:text-xs text-white/50">
            🎲 Atualizado automaticamente — {new Date().toLocaleDateString("pt-BR")}
          </p>
        </div>

        <div className="flex w-full sm:w-auto gap-2">
          <input
            className="w-full sm:w-64 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/50"
            placeholder="Buscar jogo (ex: Elden Ring)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load()}
          />
          <button
            onClick={() => load()}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500"
          >
            Buscar
          </button>
        </div>
      </section>

      {!hasUser && !loading && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm">
          Faça <span className="font-semibold">login</span> para <span className="font-semibold">favoritar</span> jogos
          e receber <span className="font-semibold">alertas de preço</span>.
        </div>
      )}

      {loadingDeals ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center text-white/70">
          Nenhuma oferta encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {deals.map((d) => (
            <GameCard key={d.dealID} deal={d} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-6 pt-4 text-sm text-white/70">
        <Link href="/favorites" className="underline">
          Meus Favoritos
        </Link>
        <span>·</span>
        <Link href="/pro" className="underline">
          Plano Pro
        </Link>
      </div>
    </div>
  )
}
