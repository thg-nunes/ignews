import { GetStaticProps } from "next"
import Head from "next/head"

import { getPrismicClient } from "../../services/prismic"

import styles from './styles.module.scss'

export default function ()  {
  return (
    <>
      <Head>
        <title>Posts | Ig News</title>
      </Head>

      <main>
        <div className={styles.container}>
          <a className={styles.posts}>
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process.</p>
          </a>
          <a className={styles.posts}>
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process.</p>
          </a>
          <a className={styles.posts}>
            <time>12 de março de 2021</time>
            <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process.</p>
          </a>
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const response = await prismic.getAllByType("post", {
    fetch: ['post.title', 'post.text']
  })

  return {
    props: {},
    revalidate: 60 * 60 * 30
  }
}
