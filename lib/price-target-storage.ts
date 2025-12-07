// lib/price-target-storage.ts

type PriceTargets = {
  // userId -> (gameId -> target)
  [userId: string]: {
    [gameId: string]: number
  }
}

const STORAGE_KEY = "lootify:priceTargets"

function safeGetStorage(): PriceTargets {
  if (typeof window === "undefined") return {}
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) as PriceTargets
  } catch {
    return {}
  }
}

function safeSetStorage(data: PriceTargets) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // se der erro, ignora
  }
}

export function getPriceTarget(userId: string, gameId: string): number | null {
  const all = safeGetStorage()
  return all[userId]?.[gameId] ?? null
}

export function setPriceTarget(
  userId: string,
  gameId: string,
  target: number | null
) {
  const all = safeGetStorage()
  if (!all[userId]) all[userId] = {}

  if (target == null || isNaN(target)) {
    delete all[userId][gameId]
  } else {
    all[userId][gameId] = target
  }

  safeSetStorage(all)
}
