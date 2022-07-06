import { GetStaticPaths, GetStaticProps } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from 'prismic-dom'
import { useEffect } from "react";

import { getPrismicClient } from "../../../services/prismic";

import styles from '../slug.module.scss'

interface PostPreviewProps {
  post: {
    slug: string
    updatedAt: string
    content: string
    title: string
    text: string
  }
}

export default function PostPreview({ post }: PostPreviewProps) {

  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if(session.data?.userActiveSubscription) {
      router.push(`/posts/${post.slug}`)
      return
    }
  }, [session])

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
            className={`${styles.postContent} ${styles.previewContent}`}
            />

            <div className={styles.continueReading}>
              Wanna continue reading?
              <Link href="/">
                <a>Subscribe now 🤗</a>
              </Link>
            </div>
        </article>
      </main>
    </>

  )
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug =  params?.slug
  const prismic = getPrismicClient()
  let post;


  if(slug) {
    const response = await prismic.getByUID('post', String(slug), {})

    post = {
      slug,
      title: RichText.asText(response.data.title),
      content: RichText.asHtml(response.data.text.splice(0, 3)),
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
