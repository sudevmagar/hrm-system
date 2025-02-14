import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;

        // Find the user in the database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Compare the provided password with the hashed password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error("Invalid password");
        }

        // Return the user object if credentials are valid
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Add the user's role to the JWT token
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role; // Add the user's role to the session
      return session;
    },
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  secret: process.env.NEXTAUTH_SECRET, // Use a secure secret
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };