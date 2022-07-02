import { loadStripe } from '@stripe/stripe-js'

export async function getStripeJs() {
  const stripeResponse = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY as string)

  return stripeResponse
}
