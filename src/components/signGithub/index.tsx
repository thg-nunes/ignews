import { signIn, signOut, useSession } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

import styles from './styles.module.scss'

export const SignGithub = () => {
  const session = useSession()

  return (session.data !== null && session.data !== undefined) ? (
    <button
      type="button"
      className={styles.signGithub}
      onClick={() => signOut()}
    >
      <FaGithub color='#04D361' />
      {session.data.user?.name}
      <FiX
        color='#737380'
        className={styles.closeButton}
      />
    </button>
  ) : (
    <button
      type="button"
      className={styles.signGithub}
      onClick={() => signIn('github')}
    >
      <FaGithub
        color='#EBA417'
      />
      Sing in with GitHub
    </button>
  )
}
