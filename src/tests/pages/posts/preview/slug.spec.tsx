import { render } from "@testing-library/react"
import { useSession } from "next-auth/react"
import { useRouter } from 'next/router'

import PostPreview from '../../../../pages/posts/preview/[slug]'

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValueOnce({
    push: jest.fn()
  })
}))

const post = {
  slug: 'slug-post',
  title: 'any_title',
  content: 'any-content',
  updatedAt: '05 de Julho de 2025',
  text: 'any_text'
}

describe('PostPreview component', () => {
  test('PostPreview renderiza corretamente', () => {
    render(<PostPreview post={post} />)
  })

  test('PostPreview renderiza corretamente', () => {
    const useSessionMocked = jest.mocked(useSession)
    const useRouterMocked = jest.mocked(useRouter)

    useSessionMocked.mockReturnValueOnce({
      data: {
        userActiveSubscription: 'active',
        expires: 'fake_expires'
      }
    } as any)

    const pushMock = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    expect(pushMock).toHaveBeenCalledWith('/posts/slug-post')
  })
})
