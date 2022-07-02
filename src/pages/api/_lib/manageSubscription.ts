import { Collection, Create, Get, Index, Match, Replace, Select } from "faunadb";
import { fauna } from "../../../services/fauna";
import { stripe } from "../../../services/stripe";

export async function saveSubscription(customerId: string, subscriptionId: string, createAction = false) {
  const userRef = await fauna.query(
    Select(
      'ref',
      Get(
        Match(
          Index('subscription_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  /* aqui busco os dados de uma inscrição feita no stripe */
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  /* retiro as informações que quero dessa inscrição */
  const subscriptionData = {
    id: subscription.id,
    status: subscription.status,
    user_id: userRef,
    price: subscription.items.data[0].price.id
  }

  if(createAction) {
    /* salvo esses dados no fauna apontando a referencia do usuario que assinou a aplicação */
    await fauna.query(
      Create(
        Collection('subscriptions'),
        { data : subscriptionData }
      )
    )
  } else {
    Replace(
      Select(
        'ref',
        Get(
          Index(
            Match('subscription_by_stripe_customer_id'),
            subscription.id
          )
        )
      ),
      { data: subscriptionData }
    )
  }
}
