import { fauna } from "../faunaDB"
import { Collection, Create, Exists, If, Index, Match, Not, Casefold, Get } from "faunadb"
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
