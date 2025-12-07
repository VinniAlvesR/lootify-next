export default function ProCancelledPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-zinc-100">
      <section className="max-w-md w-full border border-zinc-800 rounded-xl p-6 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Assinatura cancelada</h1>
        <p className="text-sm text-zinc-400">
          Sua assinatura Pro foi cancelada. Você manterá acesso até o fim do período já pago.
        </p>
        <p className="text-xs text-zinc-500">
          Se isso foi um engano, você pode assinar novamente a qualquer momento na página do plano Pro.
        </p>
      </section>
    </main>
  )
}
