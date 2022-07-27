import { render, screen } from "@testing-library/react"
import Home, { getStaticProps } from "../../pages"
import { stripe } from "../../services/stripe"

jest.mock('next-auth/react')
jest.mock("../../services/stripe")

describe('Home page', () => {
  test('Home page renderiza corretamente', () => {
    render(<Home product={{amount: 10, productId: "any_id"}} />)
    expect(screen.getByText(/for 10 month/i)).toBeInTheDocument()
  })

  test('getStaticProps retorna dados corretamente', async () => {
    const priceStripeRetieveMocked = jest.mocked(stripe.prices.retrieve)
    priceStripeRetieveMocked.mockResolvedValueOnce({
      id: 'any_id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            productId: 'any_id',
            amount: '$10.00'
          }
        },
      })
    )
  })
})

export {}
