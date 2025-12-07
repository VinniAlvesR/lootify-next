"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const supabase = supabaseBrowser;

  async function handleSend() {
    if (!email) return;
    setBusy(true);
    await supabase.auth.signInWithOtp({ email });
    setBusy(false);
    setSent(true);
  }

  
  return (
    <div className="flex items-center gap-2">
      {sent ? (
        <span className="text-xs opacity-80">Verifique seu e-mail </span>
      ) : (
        <>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-white/20 bg-transparent px-2 py-1 text-xs focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={busy}
            className="rounded-md bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
          >
            {busy ? "Enviando..." : "Entrar"}
          </button>
        </>
      )}
    </div>
  );
}
