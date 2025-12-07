"use client"

import { useState } from "react"
import Link from "next/link"

export default function ProSuccessPage() {
  const [loading] = useState(false)

  return (
    <div className="mx-auto max-w-2xl space-y-6 text-center mt-16 px-4">
      <h1 className="text-3xl font-semibold text-white">🎉 Assinatura Confirmada</h1>

      <p className="text-white/80">
        Seu Lootify Pro está ativo. Você agora tem favoritos ilimitados, histórico e alertas inteligentes.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
        <Link
          href="/"
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500 transition-colors"
        >
          Explorar ofertas
        </Link>

        {/* ⚡ Agora leva para a página de gerenciamento */}
        <Link
          href="/pro/manage"
          className="rounded-xl border border-white/15 px-5 py-3 font-medium hover:bg-white/5 transition-colors"
        >
          Gerenciar plano
        </Link>
      </div>

      <p className="text-xs text-white/50 mt-4">
        Você pode cancelar quando quiser, sem burocracia.
      </p>
    </div>
  )
}
