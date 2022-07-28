import { render, screen } from "@testing-library/react"
import { getSession } from "next-auth/react"
import Post, { getServerSideProps } from "../../../pages/posts/[slug]"
import { getPrismicClient } from "../../../services/prismic"

jest.mock('next-auth/react')
jest.mock('../../../services/prismic')

const post = {
  slug: 'any_slug',
  updatedAt: '20 de Abril de 2022',
  content: '<p>Content of my first post</p>',
  title: 'This is my first post',
  text: 'Small description of post'
}

describe('Post component', () => {
  test('garante que Post renderiza corretament', () => {
    render(<Post post={post} />)

    expect(screen.getByText(/This is my first post/i)).toBeInTheDocument()
  })

  test('getServerSideProps retorna dados corretamente', async () => {
    const getSessionMocked = jest.mocked(getSession)
    getSessionMocked.mockResolvedValueOnce({
      user: {
        name: "any_name",
        email: "any_email@gmail.com"
      },
      expires: "fake_expires"
    })

    const response = await getServerSideProps({} as any)

    expect(response).toEqual(
      expect.objectContaining( {
        redirect: {
          destination: '/',
          permanent: false
        }
      })
    )
  })

  test('getServerSideProps retorna dados corretamente se inscricao ativa', async () => {
    const getSessionMocked = jest.mocked(getSession)
    const prismicGetByUIDMocked = jest.mocked(getPrismicClient)

    getSessionMocked.mockResolvedValueOnce({
      userActiveSubscription: 'active',
    } as any)

    prismicGetByUIDMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{type: 'heading', text: 'This is my first post'}],
          text: [{type: 'paragraph', text:'Small description of post'}],
        },
        last_publication_date: '04-20-2022'
      })
    } as any)

    const response = await getServerSideProps({
      params: {
        slug: 'any_slug'
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'any_slug',
            title: 'This is my first post',
            content: '<p>Small description of post</p>',
            updatedAt: '20 de abril de 2022'
          }
        }
      })
    )
  })
})
