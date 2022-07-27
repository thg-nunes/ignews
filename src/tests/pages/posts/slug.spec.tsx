import { render, screen } from "@testing-library/react"
import { getSession } from "next-auth/react"
import Post, { getServerSideProps } from "../../../pages/posts/[slug]"

jest.mock('next-auth/react')
jest.mock('../../../services/prismic')

const post = {
  slug: 'any_slug',
  updatedAt: '20 Abril 2022',
  content: 'Content of my first post',
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
})
