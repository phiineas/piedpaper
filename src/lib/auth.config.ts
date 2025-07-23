import { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/models/drizzle";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // allow linking accounts with same email
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1);

          if (user.length === 0) {
            return null;
          }

          // check if email is verified for credentials users
          if (user[0].provider === "credentials" && !user[0].emailVerified) {
            throw new Error("please verify your email before signing in");
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            user[0].password || ""
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user[0].id,
            email: user[0].email,
            name: user[0].name,
          };
        } catch (error) {
          console.error("auth error-", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // check if user already exists
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email!))
            .limit(1);

          if (existingUser.length === 0) {
            // create new user for Google OAuth
            await db.insert(users).values({
              name: user.name!,
              email: user.email!,
              image: user.image,
              provider: "google",
              providerId: user.id,
              emailVerified: new Date(),
            });
          } else {
            // update existing user with Google info if they signed up with credentials
            if (existingUser[0].provider === "credentials") {
              await db
                .update(users)
                .set({
                  provider: "google",
                  providerId: user.id,
                  image: user.image,
                  emailVerified: new Date(),
                })
                .where(eq(users.email, user.email!));
            }
          }
          return true;
        } catch (error) {
          console.error("google sign-in error-", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // if the URL is relative or from the same domain
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      // default redirect to home after successful sign-in
      return `${baseUrl}/home`;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default authConfig;
