import { supabase } from "@/lib/supabase"

// Esta é agora a ÚNICA fonte de verdade:
// se o Supabase diz que você é Pro, você é Pro.
export async function isProEffective(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) return false

  const { data, error } = await supabase.from("profiles").select("is_pro").eq("id", user.id).single()

  if (error) return false
  return !!data?.is_pro
}
