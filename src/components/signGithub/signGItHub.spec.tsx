import { render, screen } from '@testing-library/react'
import { useSession } from 'next-auth/react'

import { SignGithub } from "."

/** Dessa forma é mockada toda a biblioteca */
jest.mock('next-auth/react')

describe('SignGithub Component', () => {
  test('Deve retornar botao com nome do usuario', () => {
    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: 'any_name',
          email: 'any_email@gmail.com',
        },
        expires: 'any_expires'
      },
      status: 'authenticated'
    })

    render(<SignGithub />)

    expect(screen.getByText('any_name')).toBeInTheDocument()
  })

  test('Deve retornar botao para login', () => {

    render(<SignGithub />)

    const useSessionMocked = jest.mocked(useSession)
    useSessionMocked.mockReturnValueOnce({data: null, status: "unauthenticated"})

    expect(screen.getByText('Sing in with GitHub')).toBeInTheDocument()
  })
})

export {}
