import { GetStaticProps } from "next"
import Head from "next/head"
import Link from "next/link"

import { getPrismicClient } from "../../services/prismic"

import styles from './styles.module.scss'

interface Post {
  slug: string
  updatedAt: string
  excerpt: string
  title: string
}

interface PostsProps {
  posts: Post []
}

export default function Posts({posts}: PostsProps)  {
  return (
    <>
      <Head>
        <title>Posts | Ig News</title>
      </Head>

      <main>
        <div className={styles.container}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`} key={post.slug}>
              <a className={styles.posts}>
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
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

  const posts = response.map(post => (
    {
      slug: post.uid,
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }),
      title: post.data.title[0].text,
      excerpt: post.data.text.find(textType => textType.type === 'paragraph')?.text ?? ''
    }
  ))

  return {
    props: {
      posts
    },
    revalidate: 60 * 60 * 30
  }
}
