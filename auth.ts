import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  // Add these configurations to help with URL issues
  trustHost: true,
  // Optionally specify the URL if auto-detection fails
  // url: process.env.NEXTAUTH_URL,
  callbacks: {
    session({ session, token }) {
      return session
    },
  },
})