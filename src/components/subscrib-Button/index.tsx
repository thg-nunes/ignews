import styles from './style.module.scss'

interface SubscribButtonProps {
  productId: string
}

export const SubscribButton = ({productId}: SubscribButtonProps) => {
  return (
    <button className={styles.subscribButton} type="button">
      Subscribe now
    </button>
  )
}
