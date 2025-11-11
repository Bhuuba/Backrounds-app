import type { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";

const providers = [] as NextAuthOptions["providers"];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    })
  );
} else {
  providers.push(
    Credentials({
      name: "Demo Account",
      credentials: {
        email: { label: "Email", type: "email" }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null;
        }
        return {
          id: credentials.email,
          name: credentials.email.split("@")[0],
          email: credentials.email
        };
      }
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/api/auth/signin"
  }
};
