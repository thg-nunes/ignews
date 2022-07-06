import axios from 'axios'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { getStripeJs } from '../../services/stripe-subscribe'
import styles from './style.module.scss'

interface SubscribButtonProps {
  productId: string
}

export const SubscribButton = ({productId}: SubscribButtonProps) => {
  const session = useSession()
  const router = useRouter()

  async function handleSubscrib() {

    if(session.status === 'unauthenticated') {
      signIn('github')
      return
    }

    if(session.data?.userActiveSubscription){
      router.push(`/posts`)
      return
    }

    try {
      const response = await axios.post('/api/subscribe')
      const { sessionId } = response.data

      const stripejsResponse = await getStripeJs()
      await stripejsResponse?.redirectToCheckout({ sessionId })

    } catch (err) {
      alert('Erro inesperado.')
    }
  }

  return (
    <button
      className={styles.subscribButton}
      type="button"
      onClick={() => handleSubscrib()}
    >
      Subscribe now
    </button>
  )
}
