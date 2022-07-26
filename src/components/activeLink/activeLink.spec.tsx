import { render } from '@testing-library/react'
import { ActiveLink } from '.'

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        asPath: '/'
      }
    }
  }
})

describe('ActiveLink Component', () => {
  test('ActiveLink renderiza corretamente', () => {
    const { getByText } = render(
      <ActiveLink href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toBeInTheDocument()
  })

  test('ActiveLink recebe classe correta', () => {
    const { getByText } = render(
      <ActiveLink href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toHaveClass('active')
  })

  test('ActiveLink recebe conteudo correto', () => {
    const { debug, getByText } = render(
      <ActiveLink href='/' activeClassName='active'>
        <a>Home</a>
      </ActiveLink>
    )

    expect(getByText('Home')).toHaveTextContent('Home')
  })
})

export {}
