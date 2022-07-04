import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from 'prismic-dom'

import { getPrismicClient } from "../../services/prismic";

import styles from './slug.module.scss'

interface PostProps {
  post: {
    slug: string
    updatedAt: string
    content: string
    title: string
    text: string
  }
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        {post.title} | Ig News
      </Head>

      <main className={styles.container}>
        <article className={styles.content}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className={styles.postContent}
            />
        </article>
      </main>
    </>

  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const slug =  params?.slug
  let post;

  if(slug) {
    const prismic = getPrismicClient()
    const session = await getSession({ req })
    const response = await prismic.getByUID('post', String(slug), {})

    console.log(session)

    post = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.text),
      updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  }

  return {
    props: {
      post
    }
  }
}
