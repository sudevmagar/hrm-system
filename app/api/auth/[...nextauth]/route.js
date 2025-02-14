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
        console.log("🛠 Received Credentials:", credentials);

        const email = credentials.email.toLowerCase(); // Ensure case insensitivity
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          console.error("❌ User not found");
          throw new Error("User not found");
        }

        console.log("🔍 Found User:", user);

        const isValid = await bcrypt.compare(credentials.password, user.password);
        console.log("🔑 Password Match:", isValid);

        if (!isValid) {
          console.error("❌ Invalid password");
          throw new Error("Invalid password");
        }

        return {
          id: user.id.toString(), // Ensure ObjectId is a string
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
