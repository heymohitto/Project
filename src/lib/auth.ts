import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Discord from "next-auth/providers/discord";
import Twitch from "next-auth/providers/twitch";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users, profiles } from "./db-schema";
import { authUtils, validationSchemas } from "./utils";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          return null;
        }

        try {
          const { emailOrUsername, password } = validationSchemas.login.parse(credentials);

          // Find user by email or username
          const user = await db
            .select()
            .from(users)
            .where(
              eq(users.email, emailOrUsername)
            )
            .limit(1);

          if (!user[0]) {
            // Try finding by username if email didn't match
            const userByUsername = await db
              .select()
              .from(users)
              .where(eq(users.username, emailOrUsername))
              .limit(1);

            if (!userByUsername[0]) {
              return null;
            }

            // Use the username match
            user[0] = userByUsername[0];
          }

          if (!user[0] || !user[0].isActive) {
            return null;
          }

          const isValidPassword = await authUtils.verifyPassword(password, user[0].passwordHash);

          if (!isValidPassword) {
            return null;
          }

          // Update last login
          await db
            .update(users)
            .set({ lastLoginAt: new Date() })
            .where(eq(users.id, user[0].id));

          return {
            id: user[0].id,
            email: user[0].email,
            username: user[0].username,
            name: user[0].displayName,
            image: user[0].avatarUrl,
            role: user[0].role,
            isPremium: user[0].isPremium,
            subscriptionTier: user[0].subscriptionTier,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: (profile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        username: profile.email.split('@')[0], // Use email prefix as username
      }),
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      profile: (profile) => ({
        id: profile.id.toString(),
        name: profile.name,
        email: profile.email,
        image: profile.avatar_url,
        username: profile.login,
      }),
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      profile: (profile) => ({
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        username: profile.username,
        discordId: profile.id,
      }),
    }),
    Twitch({
      clientId: process.env.TWITCH_CLIENT_ID!,
      clientSecret: process.env.TWITCH_CLIENT_SECRET!,
      profile: (profile) => ({
        id: profile.sub,
        name: profile.preferred_username,
        email: profile.email,
        image: profile.picture,
        username: profile.preferred_username,
      }),
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes
  },
  pages: {
    signIn: "/login",
    signUp: "/register",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        // First time login, sync data from OAuth provider
        if (account.provider !== "credentials") {
          await db
            .update(users)
            .set({
              emailVerified: true,
              lastLoginAt: new Date(),
              // Update Discord ID if available
              ...(account.provider === "discord" && { discordId: account.providerAccountId }),
            })
            .where(eq(users.id, user.id));
        }

        return {
          ...token,
          id: user.id,
          username: user.username,
          role: user.role || "user",
          isPremium: user.isPremium || false,
          subscriptionTier: user.subscriptionTier || "free",
        };
      }

      // Refresh token data on each request
      if (token.id) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.id, token.id as string))
          .limit(1);

        if (dbUser[0]) {
          return {
            ...token,
            role: dbUser[0].role,
            isPremium: dbUser[0].isPremium,
            subscriptionTier: dbUser[0].subscriptionTier,
          };
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.isPremium = token.isPremium as boolean;
        session.user.subscriptionTier = token.subscriptionTier as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Check if user is active
      if (user.id) {
        const dbUser = await db
          .select({ isActive: users.isActive })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);

        if (dbUser[0] && !dbUser[0].isActive) {
          return false;
        }
      }

      return true;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (isNewUser && account?.provider !== "credentials") {
        // New OAuth user, create profile automatically
        const newUser = await db
          .select({ id: users.id, username: users.username })
          .from(users)
          .where(eq(users.email, user.email!))
          .limit(1);

        if (newUser[0]) {
          // Auto-create a basic profile for OAuth users
          await db.insert(profiles).values({
            userId: newUser[0].id,
            slug: newUser[0].username,
            title: `${user.name || newUser[0].username}'s Links`,
            description: "Check out my links!",
            isPublic: true,
          });
        }
      }
    },
  },
});