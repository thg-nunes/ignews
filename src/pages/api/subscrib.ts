import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { stripe } from "../../services/stripe";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const session = await getSession({ req })

    if(!session?.user?.email) return

    /* aqui é criado um customer no stripe */
    const stripeCustomer = await stripe.customers.create({
      email: session.user.email
    })

    /* aqui é criado um checkout para o usuario criado a cima pelo seu id */
    const createStripeCheckout = await stripe.checkout.sessions.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      mode: 'subscription',
      line_items: [
        { price: 'price_1LGS4uHfHt62ji1jpTeueJHK', quantity: 1 }
      ],
      success_url: 'http://localhost:3000/posts',
      cancel_url: 'http://localhost:3000/',
      allow_promotion_codes: true,

    })

    res.status(200).json({sessionId: createStripeCheckout.id})

  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed.')
  }

}
