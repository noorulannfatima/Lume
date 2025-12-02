import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { User } from "../models";

export const authOptions: NextAuthOptions = {
  providers: [
    // Credentials Provider for email/password authentication
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await User.findOne({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // GitHub OAuth Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      // For OAuth providers, create or update user in database
      if (account?.provider !== "credentials") {
        const existingUser = await User.findOne({
          where: { email: user.email },
        });

        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name || null,
            image: user.image || null,
            emailVerified: new Date(),
          });
        } else {
          // Update user info from OAuth provider
          await existingUser.update({
            name: user.name || existingUser.name,
            image: user.image || existingUser.image,
            emailVerified: existingUser.emailVerified || new Date(),
          });
        }
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Add user ID to token on sign in
      if (user) {
        token.id = user.id;
      }

      // Fetch fresh user data from database
      if (token.email) {
        const dbUser = await User.findOne({
          where: { email: token.email },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.name = dbUser.name;
          token.email = dbUser.email;
          token.picture = dbUser.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      // Add user ID and other info to session
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};
