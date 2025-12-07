"use client"

import Link from "next/link"
import Image from "next/image"
import { useUser } from "@/hooks/useUser"
import AuthForm from "@/components/AuthForm"

export function Header() {
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0c10]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0b0c10]/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-3 sm:px-4 md:px-6 py-2">
        <Link href="/" className="flex items-center gap-2 text-base sm:text-lg font-semibold">
          <Image src="/logo.png" alt="Lootify" width={24} height={24} className="h-5 w-5 sm:h-6 sm:w-6" />
          <span>Lootify</span>
        </Link>

        <nav className="flex items-center gap-3 text-xs sm:text-sm overflow-x-auto no-scrollbar">
          <Link href="/" className="text-white/80 hover:text-white whitespace-nowrap">
            Ofertas
          </Link>
          <Link href="/favorites" className="text-white/80 hover:text-white whitespace-nowrap">
            Favoritos
          </Link>
          <Link href="/pro" className="text-white/80 hover:text-white whitespace-nowrap">
            Pro
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <span className="max-w-[140px] truncate rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] sm:text-xs text-white/80">
              {user.email || "Logado"}
            </span>
          ) : (
            <AuthForm />
          )}
        </div>
      </div>
    </header>
  )
}
