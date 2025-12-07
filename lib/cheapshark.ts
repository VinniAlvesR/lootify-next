export type Deal = {
  dealID: string
  title: string
  normalPrice: string
  salePrice: string
  savings: string
  thumb: string
  steamAppID?: string
}

const BASE = "https://www.cheapshark.com/api/1.0"

// Hash function to vary by date
function hash(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

// Popular stores (Steam=1, GOG=7, Humble=11, Epic=25 etc)
const STORES = [1, 7, 11, 23, 24, 25]

// Generate daily key (YYYY-MM-DD)
function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

// Normalize API response
function normalizeDeal(it: any): Deal {
  return {
    dealID: String(it.dealID ?? it.dealId ?? it.deal_id ?? ""),
    title: String(it.title ?? "Jogo"),
    normalPrice: String(it.normalPrice ?? it.retailPrice ?? "0"),
    salePrice: String(it.salePrice ?? it.price ?? "0"),
    savings: String(it.savings ?? "0"),
    thumb: String(it.thumb ?? ""),
    steamAppID: it.steamAppID ? String(it.steamAppID) : undefined,
  }
}

// Daily deals with store and page variation
export async function getDailyDeals(limit = 12): Promise<Deal[]> {
  const day = todayKey()
  const seed = hash(day)

  // Store and page based on date (changes daily)
  const storeID = STORES[seed % STORES.length]
  const pageNumber = seed % 6

  const url = `${BASE}/deals?storeID=${storeID}&sortBy=DealRating&pageNumber=${pageNumber}&pageSize=${limit * 2}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return []

  const data = (await res.json()) as any[]
  let deals = data.map(normalizeDeal)

  // Remove games seen in the last 7 days
  const seen = getRecentlySeenIds(7)
  deals = deals.filter((d) => !seen.has(d.dealID))

  // Fallback if not enough unique games
  if (deals.length < limit) {
    const topUrl = `${BASE}/deals?sortBy=DealRating&pageSize=${limit}`
    const topRes = await fetch(topUrl, { cache: "no-store" })
    const topData = topRes.ok ? ((await topRes.json()) as any[]).map(normalizeDeal) : []
    const add = topData.filter((d) => !seen.has(d.dealID))
    deals = [...deals, ...add]
  }

  deals = deals.slice(0, limit)

  // Save today's history
  saveSeenToday(
    deals.map((d) => d.dealID),
    day,
  )

  return deals
}

// Normal search by name (unchanged)
export async function searchDeals(q: string, limit = 12): Promise<Deal[]> {
  const url = `${BASE}/deals?title=${encodeURIComponent(q)}&pageSize=${limit}`
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) return []
  const data = (await res.json()) as any[]
  return data.map(normalizeDeal)
}

// Local history (last 14 days)
function getRecentlySeenIds(days: number): Set<string> {
  if (typeof localStorage === "undefined") return new Set()
  const raw = localStorage.getItem("lootify_seen_history")
  if (!raw) return new Set()
  const hist: Record<string, string[]> = JSON.parse(raw)
  const keys = Object.keys(hist).sort().reverse().slice(0, days)
  const ids = new Set<string>()
  for (const k of keys) for (const id of hist[k] || []) ids.add(id)
  return ids
}

function saveSeenToday(ids: string[], day: string) {
  if (typeof localStorage === "undefined") return
  const raw = localStorage.getItem("lootify_seen_history")
  const hist: Record<string, string[]> = raw ? JSON.parse(raw) : {}
  hist[day] = Array.from(new Set([...(hist[day] || []), ...ids]))
  const ordered = Object.keys(hist).sort()
  const pruned: Record<string, string[]> = {}
  const last14 = ordered.slice(-14)
  for (const k of last14) pruned[k] = hist[k]
  localStorage.setItem("lootify_seen_history", JSON.stringify(pruned))
}
