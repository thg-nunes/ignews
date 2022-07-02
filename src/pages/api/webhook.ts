import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream'
import Stripe from "stripe";

import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = []

  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    )
  }

  return Buffer.concat(chunks)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const relevantEvent = new Set([
  'checkout.session.completed'
])

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const buf = await buffer(req)
    let secret = req.headers['stripe-signature']

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(
        buf, secret, process.env.STRIPE_WEBHOOK_SECRET as string
      )
    } catch {
      return res.status(400).send('Webhook error.')
    }

    const { type } = event

    if(relevantEvent.has(type)) {
      try {
        switch (type) {
          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session
            if(checkoutSession.customer && checkoutSession.subscription) {
              await saveSubscription(checkoutSession.customer.toString(), checkoutSession.subscription.toString())
              break
            }
          default:
            throw new Error('Webhook handle failed.')
        }
      } catch (error) {
        res.json({message: 'Type event not handle.'})
      }
    }

  } else {
    res.setHeader('Allow','Post')
    res.status(400).send('Error.')
  }

  res.status(200).json({ok: true})
}
