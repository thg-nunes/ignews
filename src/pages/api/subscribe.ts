import { Get, Index, Match, Casefold, Update, Collection, Ref } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

interface FaunaUserProps {
  ref: {
    id: string
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method === 'POST') {
    const session = await getSession({ req })

    if(!session?.user?.email) return

    /* essa função busca os dados do user salvo no fauna que corresponde ao email do user logado na aplicação */
    const faunaUser = await fauna.query<FaunaUserProps>(
      Get(
        Match(
          Index('user_by_email'),
          Casefold(session.user.email)
        )
      )
    )

    /* busco o campo que vai identificar se o usuario ja é/foi cliente da aplicação */
    let customerId = faunaUser.data.stripe_customer_id

    /* como só vai ser criado um id de checkout novo se for um new user, evita assim duplicação de dados no stripe */
    if(!customerId) {
      /* aqui é criado um customer/cliente no stripe */
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email
      })

      /* se não for cliente, crio o novo campo nos dados pelo seu id */
      await fauna.query(
        Update(
          Ref(Collection('users'), faunaUser.ref.id), {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )

      customerId = stripeCustomer.id
    }

    /* aqui é criado um checkout para o usuario criado a cima pelo seu id */
    const createStripeCheckout = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      mode: 'subscription',
      line_items: [
        { price: 'price_1LGS4uHfHt62ji1jpTeueJHK', quantity: 1 }
      ],
      success_url: process.env.SUCCESS_SUBSCRIBE_URL as string,
      cancel_url: process.env.CANCEL_SUBSCRIBE_URL as string,
      allow_promotion_codes: true,
    })

    /* o id desse checkout é retornado para usa-lo no redirect to checkout do stripe */
    res.status(200).json({sessionId: createStripeCheckout.id})

  } else {
    res.setHeader('Allow', 'POST')
    res.status(405).end('Method not allowed.')
  }

}
