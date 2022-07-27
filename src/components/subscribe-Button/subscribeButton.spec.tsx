import { render, screen, fireEvent } from "@testing-library/react"
import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/router"
import { SubscribButton } from "."

jest.mock('next-auth/react')
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}))

describe('SubscribeButton Component', () => {
  test('SubscribeButton renderiza corretamente', () => {

    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    render (<SubscribButton />)

    expect(screen.getByText(/Subscribe now/i)).toBeInTheDocument()
  })

  test('signIn function é chamada se usuario nao tiver logado', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'unauthenticated'
    })

    const signINMocked = jest.mocked(signIn)

    render (<SubscribButton />)

    const subscribeButton = screen.getByText(/Subscribe now/i)

    fireEvent.click(subscribeButton)

    expect(signINMocked).toHaveBeenCalled()
  })

  test('usuario é redirecionado caso tenha inscricao ativa', () => {
    const useRouterMocked = jest.mocked(useRouter)
    const useSessionMocked = jest.mocked(useSession)
    const pushMock = jest.fn()

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          email: "any_email@gmail.com",
          name: "any_name"
        },
        userActiveSubscription: "active",
        expires: "any_expires"
      },
      status: "authenticated"
    })

    render (<SubscribButton />)

    const subscribeButton = screen.getByText(/Subscribe now/i)

    fireEvent.click(subscribeButton)

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })
})

export {}
