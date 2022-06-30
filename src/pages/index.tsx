import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import { SubscribButton } from '../components/subscrib-Button'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'

interface HomeProps {
  product: {
    productId: string,
    amount: number
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Inicio | Ig News</title>
      </Head>

      <main className={styles.homeContainer}>
        <section className={styles.homeContent}>
          <span>👏Hey, welcome</span>
          <h1>News about <br /> the <span>React</span> world</h1>
          <p>Get acess to all the publications <br /> <span>for {product.amount} month</span></p>
          <SubscribButton productId={product.productId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve('price_1LGS4uHfHt62ji1jpTeueJHK')

  const product = {
    productId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format((price.unit_amount as number / 100))
  }

  return {
    props: {
      product
    }
  }
}
