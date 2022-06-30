import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export const SignGithub = () => {
  const isUserLoggedIn = false

  return isUserLoggedIn ? (
    <button
      type="button"
      className={styles.signGithub}
    >
      <FaGithub color='#04D361' />
      Sing in with GitHub
      <FiX
        color='#737380'
        className={styles.closeButton}
      />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signGithub}
    >
      <FaGithub
        color='#EBA417'
      />
      Sing in with GitHub
    </button>
  )
}
