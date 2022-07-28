import { render, screen } from "@testing-library/react"
import Posts, { getStaticProps } from "../../../pages/posts"
import { getPrismicClient } from "../../../services/prismic"

jest.mock('../../../services/prismic')

const posts = [{
  slug: 'any_slug',
  updatedAt: '11 de setembro de 2022',
  excerpt: 'any_paragraph_to_post',
  title: 'any_text'
}]

describe('Posts page', () => {
  test('Posts renderizam corretamente', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText(/any_text/i)).toBeInTheDocument()
  })

  test('getStaticProps retorna dados corretamente', async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      getAllByType: jest.fn().mockResolvedValueOnce([{
        uid: 'any_slug',
        last_publication_date: '09-11-2022',
        data: {
          title: [{type: 'heading', text: 'any_text'}],
          text: [{type: 'paragraph', text: 'any_paragraph_to_post'}],
        }
      }])
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'any_slug',
            updatedAt: '11 de setembro de 2022',
            title: 'any_text',
            excerpt: 'any_paragraph_to_post'
          }]
        }
      })
    )
  })
})
