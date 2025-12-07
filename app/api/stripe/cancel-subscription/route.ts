import Stripe from "stripe"

// 1) Cria o cliente da Stripe usando a chave secreta do backend (.env)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export async function POST(req: Request) {
  try {
    // 2) Lê o corpo da requisição (JSON) enviada pelo front-end
    const { subscriptionId } = await req.json()

    // 3) Se não veio subscriptionId, já retorna erro 400 (requisição ruim)
    if (!subscriptionId) {
      return new Response(
        JSON.stringify({ error: "subscriptionId ausente" }),
        { status: 400 }
      )
    }

    // 4) Pede pra Stripe cancelar a assinatura no fim do período atual
    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    // 5) Retorna sucesso pro front com os dados da assinatura atualizada
    return new Response(
      JSON.stringify({ success: true, subscription: updatedSubscription }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error)

    // 6) Se der qualquer erro inesperado, responde 500
    return new Response(
      JSON.stringify({ error: "Falha ao cancelar assinatura" }),
      { status: 500 }
    )
  }
}
