import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Remove unused parameters - v5 doesn't pass email and credentials to signIn
      console.log("Profile", profile);
      console.log("profiel sub", profile?.sub);
      if (!profile?.sub) return false;
      
      try {
        const existingUser = await prisma.user.findUnique({
          where: { id: profile.sub }
        })

        console.log('Existing user', existingUser);
        if (!existingUser) {
        console.log('Creating new user', profile);
          await prisma.user.create({
            data: {
              id: profile.sub,
              email: profile.email || user.email || '',
              name: profile.name || user.name,
              provider: account?.provider || 'google',
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true,
            }
          })
        }
        return true;
      } catch (error) {
        console.error('Database error during sign in:', error);
        return false;
      }
    },
    
    async jwt({ token, user, profile, account }) {
      // Set user ID in token from profile or user
      if (profile?.sub && !token.id) {
        token.id = profile.sub;
      }
      
      // Store user data in token on first login
      if (user && account) {
        token.user = user;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // Add user ID to session
      if (token.id) {
        session.user.id = token.id as string;
      }
      
      // You might want to fetch fresh user data from database
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string }
          });
          
          if (dbUser) {
            session.user = {
              ...session.user,
              id: dbUser.id,
              email: dbUser.email,
              name: dbUser.name,
            };
          }
        } catch (error) {
          console.error('Error fetching user in session callback:', error);
        }
      }
      
      return session;
    },
  },

})