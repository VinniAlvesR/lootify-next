"use client"

import { useEffect, useState } from "react"
import { getPriceTarget, setPriceTarget } from "@/lib/price-target-storage"

type Props = {
  userId: string
  gameId: string
  isPro: boolean
}

export function PriceTargetInput({ userId, gameId, isPro }: Props) {
  const [value, setValue] = useState("")
  const [saving, setSaving] = useState(false)

  // carrega o preço-alvo salvo no localStorage
  useEffect(() => {
    if (!userId) return
    const current = getPriceTarget(userId, gameId)
    if (current != null) {
      setValue(String(current))
    }
  }, [userId, gameId])

  if (!isPro) {
    return (
      <p className="text-xs text-white/40">
        Preço-alvo <span className="text-yellow-400 font-semibold">Pro</span>
      </p>
    )
  }

  async function handleBlur() {
    const text = value.trim()
    const num = text ? Number(text.replace(",", ".")) : null

    setSaving(true)
    setPriceTarget(userId, gameId, num)
    setSaving(false)
  }

  return (
    <div className="flex items-center gap-2 text-xs text-white/70 mt-1">
      <span>Preço-alvo:</span>
      <input
        className="w-20 rounded-md bg-black/40 border border-white/15 px-2 py-1 text-xs"
        placeholder="ex: 20"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        disabled={saving}
      />
      <span>R$</span>
    </div>
  )
}
