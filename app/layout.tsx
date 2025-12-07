import type React from "react"
import "./globals.css"
import { Header } from "@/components/Header"
import Link from "next/link"

export const metadata = {
  title: "Lootify — Ofertas de Jogos",
  description: "Promoções diárias de jogos (Steam, Epic e mais)",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-[#0b0c10] text-white">
        <Header />
        <main className="mx-auto w-full max-w-6xl px-3 sm:px-4 md:px-6 py-6">{children}</main>
        <footer className="border-t border-white/10 py-8 text-center text-sm text-white/60">
          <div className="mx-auto max-w-6xl px-4">
            Feito por{" "}
            <Link className="underline" href="https://nextdevz.com">
              Next Devz
            </Link>{" "}
            · Lootify © {new Date().getFullYear()}
          </div>
        </footer>
      </body>
    </html>
  )}