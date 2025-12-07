// lib/favorites.ts
import { supabaseBrowser } from "@/lib/supabase-browser"
import { isProEffective } from "@/lib/pro"

// 🔹 Tipo base dos favoritos (bate com o que a página espera)
export type FavoriteRow = {
  id: string
  user_id: string
  game_id: string
  title: string
  thumb?: string | null
  created_at?: string
}

export async function addFavorite({
  game_id,
  title,
  thumb,
}: {
  game_id: string
  title: string
  thumb?: string
}) {
  const supabase = supabaseBrowser

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr) {
    console.error(userErr)
  }

  if (!user) {
    alert("Faça login para favoritar.")
    return
  }

  // 🔹 evita duplicar o mesmo jogo nos favoritos
  const { data: existing, error: existingErr } = await supabase
    .from("favorites")
    .select("id") // sem genérico aqui
    .eq("user_id", user.id)
    .eq("game_id", game_id)
    .maybeSingle()

  if (existingErr) {
    console.error(existingErr)
  }

  if (existing) {
    alert("Esse jogo já está nos seus favoritos.")
    return
  }

  // 🔹 regra de limite do plano grátis (5 favoritos)
  const isPro = await isProEffective()
  if (!isPro) {
    const { count, error: countErr } = await supabase
      .from("favorites")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (countErr) {
      console.error(countErr)
    }

    if (!countErr && typeof count === "number" && count >= 5) {
      alert(
        "Limite do plano Grátis atingido (5 favoritos). Assine o Pro para favoritos ilimitados.",
      )
      return
    }
  }

  // 🔹 insere favorito
  const { error } = await supabase.from("favorites").insert({
    user_id: user.id,
    game_id,
    title,
    thumb,
  })

  if (error) {
    console.error(error)
    alert("Não foi possível favoritar esse jogo. Tente novamente.")
  } else {
    alert("Jogo favoritado com sucesso!")
  }
}

export async function listFavorites() {
  const supabase = supabaseBrowser

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr) {
    console.error(userErr)
  }

  if (!user) return [] as FavoriteRow[]

  const { data, error } = await supabase
    .from("favorites")
    .select("id, user_id, game_id, title, thumb, created_at") // 👈 sem genérico

  if (error) {
    console.error(error)
    alert("Não foi possível carregar seus favoritos.")
    return []
  }

  // força o tipo aqui, onde faz sentido
  return (data ?? []) as FavoriteRow[]
}

export async function removeFavorite(id: string) {
  const supabase = supabaseBrowser

  const {
    data: { user },
    error: userErr,
  } = await supabase.auth.getUser()

  if (userErr) {
    console.error(userErr)
  }

  if (!user) return

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)

  if (error) {
    console.error(error)
    alert("Não foi possível remover esse favorito.")
  }
}
