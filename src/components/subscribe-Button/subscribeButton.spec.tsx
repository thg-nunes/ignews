import { render, screen, fireEvent } from "@testing-library/react"
import { signIn } from "next-auth/react"
import { SubscribButton } from "."

jest.mock('next-auth/react', () => {
  return {
    useSession() {
      return {
        data: null,
        status: 'unauthenticated'
      }
    },
    signIn: jest.fn()
  }
})

describe('SubscribeButton Component', () => {
  test('SubscribeButton renderiza corretamente', () => {

    render (<SubscribButton />)

    expect(screen.getByText(/Subscribe now/i)).toBeInTheDocument()
  })

  test('signIn function é chamada se usuario nao tiver logado', () => {
    const signINMocked = jest.mocked(signIn)

    const { debug } = render (<SubscribButton />)

    const subscribeButton = screen.getByText(/Subscribe now/i)

    fireEvent.click(subscribeButton)

    expect(signINMocked).toHaveBeenCalled()
    debug()
  })
})

export {}
