"use client"

import { useEffect, useState } from "react"
import { listFavorites, removeFavorite } from "@/lib/favorites"

// 🔹 Auth centralizado do Lootify
import { useLootifyAuth } from "@/lib/useLootifyAuth"

// 🔹 Pro
import { isProEffective } from "@/lib/pro"

// 🔹 Preço-alvo (localStorage)
import { PriceTargetInput } from "@/components/PriceTargetInput"
import { getPriceTarget } from "@/lib/price-target-storage"

type FavoriteItemData = {
  id: string
  game_id: string
  title: string
  thumb?: string | null
}

export default function FavoritesPage() {
  const { user, loading } = useLootifyAuth()
  const [items, setItems] = useState<FavoriteItemData[]>([])
  const [isPro, setIsPro] = useState(false)

  async function load() {
    const data = await listFavorites()
    setItems(data)
  }

  // 🔹 Verifica plano Pro quando usuário carregar
  useEffect(() => {
    if (user) {
      isProEffective().then(setIsPro)
    }
  }, [user])

  // 🔹 Carrega favoritos quando já soubermos o usuário
  useEffect(() => {
    if (!loading && user) {
      load()
    }
  }, [loading, user])

  if (loading) return null

  if (!user)
    return (
      <div className="rounded-xl border border-white/10 bg-white/5 p-6">
        Faça login para ver seus favoritos.
      </div>
    )

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">⭐ Meus Favoritos</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-white/70">
          Você ainda não favoritou nenhum jogo.
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3">
          {items.map((it) => (
            <FavoriteItem
              key={it.id}
              item={it}
              userId={user.id}
              isPro={isPro}
              onRemoved={load}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

// 🔹 Item isolado pra poder usar hooks sem quebrar regra
function FavoriteItem({
  item,
  userId,
  isPro,
  onRemoved,
}: {
  item: FavoriteItemData
  userId: string
  isPro: boolean
  onRemoved: () => Promise<void>
}) {
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  // 🔹 preço atual (CheapShark)
  useEffect(() => {
    async function loadPrice() {
      try {
        const res = await fetch(
          `https://www.cheapshark.com/api/1.0/deals?id=${item.game_id}`,
        )
        const json = await res.json()

        // tenta vários campos conhecidos da CheapShark:
        const raw =
          json?.gameInfo?.salePrice ??
          json?.deal?.salePrice ??
          json?.salePrice ??
          json?.retailPrice ??
          0

        const price = Number(raw) || 0
        setCurrentPrice(price)
      } catch (e) {
        console.error("Erro ao carregar preço:", e)
        setCurrentPrice(0)
      }
    }
    loadPrice()
  }, [item.game_id])

  // 🔹 preço-alvo salvo no localStorage (só faz sentido pra Pro)
  const target = isPro ? getPriceTarget(userId, item.game_id) : null

  // 🔹 atingiu o alvo?
  const hitTarget =
    isPro && target != null && currentPrice != null && currentPrice <= target

  async function handleRemove() {
    setBusy(true)
    await removeFavorite(item.id)
    await onRemoved()
    setBusy(false)
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
      {item.thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumb || "/placeholder.svg"}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="h-14 w-14 rounded-lg object-cover"
        />
      ) : (
        <div className="h-14 w-14 rounded-lg bg-white/10" />
      )}

      <div className="min-w-0 flex-1">
        {/* 🔹 Título + badge caso abaixo do alvo */}
        <div className="flex items-center justify-between">
          <div className="truncate text-sm font-semibold">{item.title}</div>

          {hitTarget && (
            <span className="ml-2 rounded-full border border-green-400/60 px-2 py-0.5 text-[10px] text-green-300">
              🔔 Abaixo do alvo
            </span>
          )}
        </div>

        {/* 🔹 ID com limite pra não estourar o card */}
        <div className="mt-0.5 max-w-xs overflow-hidden text-ellipsis break-all text-[10px] text-white/50">
          <span className="font-semibold text-white/70">ID:</span> {item.game_id}
        </div>

        {/* 🔹 Preço atual */}
        <div className="mt-1 text-xs text-white/70">
          Preço atual:{" "}
          {currentPrice != null ? (
            <span className="font-semibold text-white">
              R$ {currentPrice.toFixed(2)}
            </span>
          ) : (
            "carregando…"
          )}
        </div>

        {/* 🔹 Preço-alvo / Pro */}
        {isPro ? (
          <PriceTargetInput
            userId={userId}
            gameId={item.game_id}
            isPro={isPro}
          />
        ) : (
          <p className="mt-1 text-[11px] text-white/40">
            Alertas de preço são um recurso do plano{" "}
            <span className="font-semibold text-amber-300">Pro</span>.
          </p>
        )}
      </div>

      <button
        onClick={handleRemove}
        className="rounded-lg bg-red-600 px-3 py-2 text-xs sm:text-sm font-medium hover:bg-red-500 disabled:opacity-50"
        disabled={busy}
      >
        Remover
      </button>
    </li>
  )
}
