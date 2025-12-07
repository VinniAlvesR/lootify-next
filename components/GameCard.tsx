"use client"

import type { Deal } from "@/lib/cheapshark"
import { addFavorite } from "@/lib/favorites"
import { useLootifyAuth } from "@/lib/useLootifyAuth"

export default function GameCard({ deal }: { deal: Deal }) {
  const { user, loading } = useLootifyAuth()

  // 🔹 garante que savings/price virem número e não NaN
  const discountPct = Math.round(Number(deal.savings ?? 0))
  const price = Number(deal.salePrice ?? 0)
  const normal = Number(deal.normalPrice ?? 0)

  async function handleFavorite() {
    // ainda carregando info de login → não faz nada
    if (loading) return

    // se não estiver logado, mostra alerta e sai
    if (!user) {
      alert("Faça login para favoritar")
      return
    }

    // logado → chama a função que salva o favorito
    await addFavorite({
      // 🔹 esse ID é o mesmo que usamos na página de favoritos
      // e pra buscar o preço depois: /deals?id={dealID}
      game_id: deal.dealID,
      title: deal.title,
      thumb: deal.thumb,
    })
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5">
      <div className="relative w-full aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deal.thumb || "/placeholder.svg"}
          alt={deal.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm sm:text-[15px] font-semibold leading-snug">
          {deal.title}
        </h3>

        <div className="flex flex-wrap items-baseline gap-2 text-sm">
          <span className="text-lg font-bold">R$ {price.toFixed(2)}</span>
          <span className="text-white/50 line-through">
            R$ {normal.toFixed(2)}
          </span>
          {discountPct > 0 && (
            <span className="rounded-md bg-green-600/20 px-2 py-0.5 text-xs text-green-400">
              -{discountPct}%
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <a
            href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[36px] rounded-xl bg-blue-600 px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-blue-500"
          >
            Ver Oferta
          </a>

          <button
            onClick={handleFavorite}
            className="min-h-[36px] rounded-xl border border-white/10 px-3 py-2 text-xs sm:text-sm hover:bg-white/5"
          >
            ⭐ Favoritar
          </button>
        </div>
      </div>
    </article>
  )
}
