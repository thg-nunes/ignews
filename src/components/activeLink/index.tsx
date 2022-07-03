import Link, { LinkProps } from "next/link"
import { useRouter } from "next/router"
import { ReactElement, cloneElement } from "react"

interface ActiveLinkProps extends LinkProps {
  children: ReactElement
  activeClassName: string
}

export const ActiveLink = ({children, activeClassName, ...rest}: ActiveLinkProps) => {
  const { asPath } = useRouter()
  /* se a rota ativa for igual ao href do link, coloca a activeClassName */
  const className = asPath === rest.href ? activeClassName : ''

  {/* cloneElement: clono o children do link e altero a propriedade que desejo */}
  return (
    <Link {...rest}>
      {cloneElement(children, {
        className
      })}
    </Link>
  )
}
