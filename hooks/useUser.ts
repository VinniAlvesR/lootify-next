"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useUser() {
  const [user, setUser] = useState<null | { id: string; email?: string }>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ? { id: data.user.id, email: data.user.email ?? undefined } : null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? undefined } : null)
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
