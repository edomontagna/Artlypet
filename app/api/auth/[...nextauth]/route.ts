import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // TODO: Replace with actual database lookup
        // This is a demo - in production, verify against your database
        if (credentials?.email && credentials?.password) {
          // Demo: accept any valid email and password with at least 6 chars
          if (credentials.password.length >= 6) {
            return {
              id: "1",
              email: credentials.email,
              name: credentials.email.split("@")[0],
            };
          }
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as Record<string, unknown>).id = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
});

export { handler as GET, handler as POST };
