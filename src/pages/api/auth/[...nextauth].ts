import { fauna } from "../../../services/fauna"
import { Collection, Create, Exists, If, Index, Match, Not, Casefold, Get, Select, Intersection } from "faunadb"
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({session}) {
      if(session) {
        if(session.user?.email) {
          try {
            const userActiveSubscription = await fauna.query(
              Get(
                Intersection([
                  Match(
                    Index('status_subscription_by_user_id'),
                    Select(
                      'ref',
                      Get(
                        Match('user_by_email'),
                        Casefold(session.user.email)
                      )
                    )
                  ),
                  Index(
                    Match('status_subscription_by_user_id'),
                    'active'
                  )
                ])
              )
            )
            return {...session, expires: session.expires, statusSubscription: userActiveSubscription}
          } catch {
            return {...session, expires: session.expires, }
          }
        }
      }
    },

    async signIn({user}) {
      const email = user.email !== null && user.email !== undefined ? user.email : ''

      try {
        await fauna.query(
          If(
            Not(
              Exists(
                Match(
                  Index('user_by_email'),
                  Casefold(email)
                )
              )
            ),
            Create(
              Collection('users'),
              {
                data: { email }
              }
            ),
            Get(
              Match(
                Index('user_by_email'),
                Casefold(email)
              )
            )
          ))
          return true
      } catch {
        return false
      }
    }
  }
})
