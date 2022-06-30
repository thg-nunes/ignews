import type { NextPage } from 'next'
import Head from 'next/head'
import { SubscribButton } from '../components/subscrib-Button'

import styles from './home.module.scss'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Inicio | Ig News</title>
      </Head>

      <main className={styles.homeContainer}>
        <section className={styles.homeContent}>
          <span>👏Hey, welcome</span>
          <h1>News about <br /> the <span>React</span> world</h1>
          <p>Get acess to all the publications <br /> <span>for $9,90 month</span></p>
          <SubscribButton />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding" />
      </main>
    </>
  )
}

export default Home
